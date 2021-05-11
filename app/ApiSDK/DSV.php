<?php

declare(strict_types=1);

namespace App\ApiSDK\DSV\Client;

use const PHP_QUERY_RFC3986;
use Psr\Http\Client\ClientExceptionInterface;
use Psr\Http\Client\ClientInterface as HttpClientInterface;
use Psr\Http\Message\RequestFactoryInterface;
use Psr\Http\Message\StreamFactoryInterface;
use function Safe\json_decode;
use function Safe\json_encode;
use Setono\PostNord\Exception\RequestFailedException;

final class Client implements \Setono\PostNord\Client\ClientInterface
{
    /** @var HttpClientInterface */
    private $httpClient;

    /** @var RequestFactoryInterface */
    private $requestFactory;

    /** @var StreamFactoryInterface */
    private $streamFactory;

    /** @var string */
    private $apiKey;

    /** @var string */
    private $baseUrl;

    public function __construct(
        HttpClientInterface $httpClient,
        RequestFactoryInterface $requestFactory,
        StreamFactoryInterface $streamFactory,
        string $apiKey,
        string $baseUrl = 'https://api.bring.com'
    ) {
        $this->httpClient = $httpClient;
        $this->requestFactory = $requestFactory;
        $this->streamFactory = $streamFactory;
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
    }

    /**
     * @throws ClientExceptionInterface
     */
    public function get(string $endpoint, array $params = []): array
    {
        return $this->sendRequest('GET', $endpoint, $params);
    }

    /**
     * @throws ClientExceptionInterface
     */
    public function post(string $endpoint, array $params = [], array $body = []): array
    {
        return $this->sendRequest('POST', $endpoint, $params, $body);
    }

    /**
     * @throws ClientExceptionInterface
     */
    private function sendRequest(string $method, string $endpoint, array $params = [], array $body = []): array
    {
        $url = $this->baseUrl . '/' . ltrim($endpoint, '/') . '?' . http_build_query($params, '', '&', PHP_QUERY_RFC3986);

        $request = $this->requestFactory->createRequest($method, $url);

        $request = $request->withHeader("Content-type", "application/json");
        $request = $request->withHeader("Accept", "application/json");
        $request = $request->withHeader("X-MyBring-API-Key", $this->apiKey);

        if (count($body) > 0) {
            $request = $request->withBody($this->streamFactory->createStream(json_encode($body)));
        }

        $response = $this->httpClient->sendRequest($request);

        if (200 !== $response->getStatusCode() && 201 !== $response->getStatusCode()) {
            throw new RequestFailedException($request, $response, $response->getStatusCode());
        }

        return (array) json_decode((string) $response->getBody(), true);
    }
}
