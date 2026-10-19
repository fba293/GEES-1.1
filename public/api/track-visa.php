<?php
/**
 * Global Education Expert Services (GEES)
 * EMGS Student Visa Tracking Secure API Proxy
 * Designed for cPanel Apache / LiteSpeed hosting environments
 *
 * Route: /api/track-visa.php (or /api/track-visa via .htaccess)
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Allow same-origin requests; if cross-origin, restrict to authorized domains
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedDomains = [
    'https://globaleducationexpert.com',
    'https://www.globaleducationexpert.com',
    'http://localhost:3000',
    'http://localhost:5173'
];

if (in_array($origin, $allowedDomains, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'errorCode' => 'METHOD_NOT_ALLOWED',
        'error' => 'Only POST requests are supported.'
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// Read and decode JSON payload
$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errorCode' => 'INVALID_PAYLOAD',
        'error' => 'Invalid JSON payload received.'
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

$rawPassport = isset($data['passportNumber']) ? trim((string)$data['passportNumber']) : '';
$rawNationality = isset($data['nationalityCode']) ? trim((string)$data['nationalityCode']) : '';

// 1. Sanitize & Validate Passport
$passport = strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', $rawPassport));
if (strlen($passport) < 5 || strlen($passport) > 15) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'errorCode' => 'INVALID_PASSPORT',
        'error' => 'Passport number must be between 5 and 15 alphanumeric characters.'
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// 2. Sanitize & Validate Nationality Code (ISO 3-alpha standard)
$nationality = strtoupper(preg_replace('/[^a-zA-Z]/', '', $rawNationality));
if (strlen($nationality) !== 3) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'errorCode' => 'INVALID_NATIONALITY',
        'error' => 'Nationality must be a valid 3-letter ISO country code.'
    ], JSON_UNESCAPED_SLASHES);
    exit;
}

// 3. Simple Rate Limiting (Session/IP-based throttle)
$clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$throttleDir = sys_get_temp_dir() . '/gees_rate_limit';
if (!is_dir($throttleDir)) {
    @mkdir($throttleDir, 0700, true);
}
$throttleFile = $throttleDir . '/' . md5($clientIp) . '.txt';
$now = time();

if (file_exists($throttleFile)) {
    $lastReq = (int)@file_get_contents($throttleFile);
    if (($now - $lastReq) < 2) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'errorCode' => 'RATE_LIMITED',
            'error' => 'Please wait a moment between status checks.'
        ], JSON_UNESCAPED_SLASHES);
        exit;
    }
}
@file_put_contents($throttleFile, (string)$now);

// 4. Check for configured Institutional / Partner API credentials
$emgsApiKey = getenv('EMGS_INSTITUTIONAL_API_KEY') ?: ($_ENV['EMGS_INSTITUTIONAL_API_KEY'] ?? null);
$emgsEndpoint = getenv('EMGS_INSTITUTIONAL_ENDPOINT') ?: ($_ENV['EMGS_INSTITUTIONAL_ENDPOINT'] ?? null);

if ($emgsApiKey && $emgsEndpoint) {
    // If institutional gateway is configured, query securely server-side
    $ch = curl_init($emgsEndpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'passport_number' => $passport,
        'nationality' => $nationality
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $emgsApiKey
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $response) {
        $parsed = json_decode($response, true);
        if ($parsed && isset($parsed['status'])) {
            echo json_encode([
                'success' => true,
                'data' => $parsed
            ], JSON_UNESCAPED_SLASHES);
            exit;
        }
    }
}

// 5. Official Compliance & Verification Handling:
// EMGS public verification requires interactive human verification (reCAPTCHA and session token)
// on https://visa.educationmalaysia.gov.my/emgs/application/searchForm/.
// In strict adherence to official terms and privacy security, we do not fabricate records
// or attempt unauthorized CAPTCHA circumvention. We direct the student to the official portal.
http_response_code(200);
echo json_encode([
    'success' => false,
    'errorCode' => 'DIRECT_VERIFICATION_REQUIRED',
    'error' => 'Official EMGS live status lookup requires direct Malaysian government portal verification. Please verify directly on the official tracker.',
    'officialTrackerUrl' => 'https://visa.educationmalaysia.gov.my/emgs/application/searchForm/',
    'suggestOfficialPortal' => true,
    'normalizedPassport' => $passport,
    'nationalityCode' => $nationality
], JSON_UNESCAPED_SLASHES);
