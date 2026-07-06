$routes = @('/', '/join', '/discover/twinn', '/join/quiz/twinn', '/discover/study', '/discover/hackathon', '/discover/gym')
foreach ($route in $routes) {
    $url = "http://localhost:3000" + $route
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 0 -ErrorAction Ignore
        $code = $response.StatusCode
    } catch {
        $code = "ERR"
    }
    Write-Host "$route => $code"
}
