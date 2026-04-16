<?php
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'health';

$nimKey = getenv('NIM_API_KEY');
$nimHost = rtrim(getenv('NIM_API_HOST') ?: 'https://integrate.api.nvidia.com/v1', '/');

$catalogPath = __DIR__ . '/../model-hub/public-model-catalog.json';
$routingPath = __DIR__ . '/../model-hub/task-routing.json';

function readJsonFileSafe($path) {
  if (!file_exists($path)) {
    return null;
  }

  $content = file_get_contents($path);
  if ($content === false) {
    return null;
  }

  $decoded = json_decode($content, true);
  if (!is_array($decoded)) {
    return null;
  }

  return $decoded;
}

function respond($statusCode, $data) {
  http_response_code($statusCode);
  echo json_encode($data);
  exit;
}

function requestBody() {
  $raw = file_get_contents('php://input');
  if (!$raw) {
    return [];
  }

  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : [];
}

if ($action === 'health') {
  respond(200, [
    'ok' => true,
    'service' => 'trconnects-cpanel-api',
    'nimConfigured' => !empty($nimKey)
  ]);
}

if ($action === 'models') {
  $catalog = readJsonFileSafe($catalogPath);
  $routing = readJsonFileSafe($routingPath);

  respond(200, [
    'catalog' => $catalog,
    'routing' => $routing
  ]);
}

if ($action === 'chat') {
  if ($method !== 'POST') {
    respond(405, ['error' => 'Method not allowed']);
  }

  if (empty($nimKey)) {
    respond(500, ['error' => 'NIM_API_KEY is not configured on server']);
  }

  $payload = requestBody();
  $messages = isset($payload['messages']) && is_array($payload['messages']) ? $payload['messages'] : [];
  $task = isset($payload['task']) ? $payload['task'] : 'web';
  $forcedModel = isset($payload['model']) ? trim($payload['model']) : '';

  $routing = readJsonFileSafe($routingPath);
  if (!is_array($routing)) {
    respond(500, ['error' => 'task-routing.json not found or invalid']);
  }

  $modelOrder = [];
  if (!empty($forcedModel)) {
    $modelOrder[] = $forcedModel;
  } else if (isset($routing[$task]) && is_array($routing[$task])) {
    $modelOrder = $routing[$task];
  } else {
    $modelOrder = isset($routing['web']) ? $routing['web'] : [];
  }

  if (count($modelOrder) === 0) {
    respond(500, ['error' => 'No models configured for task']);
  }

  $errors = [];
  foreach ($modelOrder as $model) {
    $requestPayload = [
      'model' => $model,
      'messages' => $messages,
      'stream' => false,
      'temperature' => 0.2
    ];

    $ch = curl_init($nimHost . '/chat/completions');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
      'Authorization: Bearer ' . $nimKey,
      'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestPayload));

    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
      $errors[] = $model . ': ' . $curlErr;
      continue;
    }

    $decoded = json_decode($response, true);

    if ($status >= 200 && $status < 300) {
      $content = '';
      if (isset($decoded['choices'][0]['message']['content'])) {
        $content = $decoded['choices'][0]['message']['content'];
      }

      respond(200, [
        'task' => $task,
        'model' => $model,
        'message' => [
          'role' => 'assistant',
          'content' => $content
        ]
      ]);
    }

    $errMsg = 'request failed';
    if (isset($decoded['error']['message'])) {
      $errMsg = $decoded['error']['message'];
    }

    $errors[] = $model . ': ' . $errMsg;
  }

  respond(502, [
    'error' => 'All routed models failed',
    'details' => $errors
  ]);
}

respond(404, ['error' => 'Unknown action']);
