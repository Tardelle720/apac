<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// Default route
$routes->get('/', 'Home::index');

// Resource routes for fornecedores (API RESTful)
$routes->resource('fornecedores', ['controller' => 'FornecedorController']);

