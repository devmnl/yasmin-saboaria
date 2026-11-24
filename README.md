# Yasbella Saboaria — catálogo

Protótipo responsivo inspirado na estrutura observada no site de referência: promoção, busca, navegação, vitrine de produtos, categorias, história da marca, carrinho e página de produto. A identidade visual usa o emblema enviado por você.

## Abrir

Abra `index.html` em um navegador. Não há dependências de build.

## Personalizar antes de vender

Edite `app.js`:

- `STORE.whatsapp`: telefone no formato internacional, só números (ex.: `5511999999999`). O pedido será enviado como mensagem pré-preenchida no WhatsApp.
- `STORE.email` e `STORE.instagram`: canais da loja.
- `PRODUCTS`: nomes, fragrâncias, imagens, descrições e preços. O preço `null` aparece como “Consulte”.

As fotos do catálogo ficam em `assets/products/`. Confirme a composição e a disponibilidade com a loja antes de publicar essas informações.

## Limites atuais

O carrinho funciona neste navegador e salva seus itens localmente. O protótipo não processa pagamentos, calcula frete, controla estoque nem registra pedidos em um servidor. O botão de finalizar monta uma mensagem de pedido no WhatsApp após configurar o telefone.

O catálogo exibe as seis fragrâncias, pesos e preços informados pela loja; composição e disponibilidade ainda precisam ser confirmadas. O protótipo não processa pagamentos, calcula frete, controla estoque nem registra pedidos em um servidor. Para publicar uma loja com checkout, pagamentos e logística, conecte este design a uma plataforma de e-commerce (por exemplo, Nuvemshop) ou implemente os serviços correspondentes.
