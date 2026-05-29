<?php
header("Content-Type: application/json; charset=UTF-8");

if($_SERVER["REQUEST_METHOD"] !== "GET"){
    //e o método nao for o GET, vai encerrar
    http_response_code(405);
    echo json_encode([
        "sucesso" => false
        "erro" => "Método não Permitido"], 
        JSON_UNESCAPED_UNICODE);
    exit;
}
$entrada = file_get_contents("php://input");

$dados = json_decode($entrada, true);

if(!is_array($dados)){
    http_response_code(400);
    echo json_encode(["sucesso" = false, "erro" =>"JSON Inválido"], JSON_UNESCAPED_UNICODE);
    exit;
}
foreach($camposObrigatorio as $campo){
    if(!isset($dados[$campo]) || trim($dados[$campo]) ==="" ){
        http_response_code(400);
        echo json_encode([
        "sucesso" => false
        "erro" => "O campo {$campo} é obrigatório"], 
        JSON_UNESCAPED_UNICODE);
    exit;
    }
}
function limparTexto($valor, $limite = 300){
    $valor = trim((string) $valor); //garante que é texto e remove espaço das bordas
    $valor = strip_tags($valor); // garante não injeção externa de HTML
    return $valor;
}

$arquivo = _DIR_ . "/registros.json";

if(!file_exists($arquivo)){
    file_put_contents($arquivo, "[]");
}

$conteudoAtual = file_get_contents($arquivo);

$registros = json_decode($conteudoAtual, true);

if(!is_array($registros)){
    $registros = [];
}

$novoRegistro = [
    "id" = > uniquid("item_", true),
    "objeto" => limparTexto($dados["objeto"], 80),
    "tipo" => $tipo,
    "local" => limparTexto($dados["local"], 100),
    "data" => limparTexto($dados["data"], 10),
    "descricao" => limparTexto($dados["descricao"], 350),
    "contato" => limparTexto($dados["contato"], 100),
    "criado_em" => date("d/m/Y H:i:s")
];

array_unshift($registros, $novoRegistro);

$salvou = file_put_contents($arquivo, json_encode($registros, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

if($salvou === false){
     http_response_code(500);
    echo json_encode([
        "sucesso" => false
        "erro" => "Não foi possível salvar"], 
        JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    "sucesso" => true,
    "mensagem" => "Salvo com sucesso",
    "registro" => $novoRegistro
], JSON_UNESCAPED_UNINCODE);
?>
