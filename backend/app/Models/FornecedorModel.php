<?php

namespace App\Models;

use CodeIgniter\Model;

class FornecedorModel extends Model
{
    protected $table      = 'fornecedores';
    protected $primaryKey = 'id';

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'nome',
        'tipo_documento',
        'documento',
        'endereco',
    ];

    // Validation
    protected $validationRules = [
        'nome'           => 'required|max_length[300]',
        'tipo_documento' => 'required|integer',
        'documento'      => 'required|max_length[30]',
        'endereco'       => 'permit_empty|max_length[70]',
    ];

    protected $validationMessages = [
        'nome' => [
            'required'   => 'O campo nome é obrigatório.',
            'max_length' => 'O nome deve ter no máximo 300 caracteres.',
        ],
        'tipo_documento' => [
            'required' => 'O tipo de documento é obrigatório.',
            'integer'  => 'O tipo de documento deve ser um número inteiro.',
        ],
        'documento' => [
            'required'   => 'O documento é obrigatório.',
            'max_length' => 'O documento deve ter no máximo 30 caracteres.',
        ],
        'endereco' => [
            'max_length' => 'O endereço deve ter no máximo 70 caracteres.',
        ],
    ];

    protected $skipValidation = false;
}
