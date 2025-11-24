<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\FornecedorModel;

class FornecedorController extends ResourceController
{
    protected $modelName = FornecedorModel::class;
    protected $format    = 'json';

    // GET /fornecedores
    public function index()
    {
        $fornecedores = $this->model->findAll();

        return $this->respond($fornecedores);
    }

    // GET /fornecedores/{id}
    public function show($id = null)
    {
        if (empty($id)) {
            return $this->failNotFound('ID não informado.');
        }

        $fornecedor = $this->model->find($id);

        if (! $fornecedor) {
            return $this->failNotFound('Fornecedor não encontrado.');
        }

        return $this->respond($fornecedor);
    }

    // POST /fornecedores
    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();

        if (empty($data)) {
            return $this->failValidationErrors('Nenhum dado recebido.');
        }

        $insertId = $this->model->insert($data);

        if ($insertId === false) {
            $errors = $this->model->errors();
            return $this->failValidationErrors($errors);
        }

        $created = $this->model->find($insertId);

        return $this->respondCreated($created);
    }

    // PUT/PATCH /fornecedores/{id}
    public function update($id = null)
    {
        if (empty($id)) {
            return $this->failNotFound('ID não informado.');
        }

        $exists = $this->model->find($id);

        if (! $exists) {
            return $this->failNotFound('Fornecedor não encontrado.');
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        if (empty($data)) {
            return $this->failValidationErrors('Nenhum dado recebido para atualização.');
        }

        $updated = $this->model->update($id, $data);

        if ($updated === false) {
            $errors = $this->model->errors();
            return $this->failValidationErrors($errors);
        }

        $resource = $this->model->find($id);

        return $this->respondUpdated($resource);
    }

    // DELETE /fornecedores/{id}
    public function delete($id = null)
    {
        if (empty($id)) {
            return $this->failNotFound('ID não informado.');
        }

        $exists = $this->model->find($id);

        if (! $exists) {
            return $this->failNotFound('Fornecedor não encontrado.');
        }

        $deleted = $this->model->delete($id);

        if ($deleted === false) {
            return $this->failServerError('Erro ao deletar fornecedor.');
        }

        return $this->respondDeleted(['id' => $id, 'message' => 'Fornecedor deletado.']);
    }
}
