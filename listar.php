<?php
/* endpoint- faz a leitura */
header("Content-Type: application/json; charset=UTF-8")

if($_SERVER["REQUEST_METHOD"] !== "GET"){
    //e o método nao for o GET, vai encerrar
    http_response_code(405);
    echo json_encode(["erro" => "Método não Permitido"], JSON_UNESCAPED_UNICODE);
    exit;
}
$arquivo = _DIR_ . "/registros.json";

if(!file_exists($arquivo)){
    echo json_encode([], JSON_UNESCAPED_UNICODE);
    exit;
}

$conteudo = file_get_contents($arquivo);

$registro = json_decode($conteudo, true);

echo json_encode($registro, JSON_UNESCAPED_UNICODE);

?>
