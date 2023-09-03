const venom = require('venom-bot');
const fs = require('fs');

// Função para carregar respostas personalizadas do arquivo JSON
function carregarRespostasPersonalizadas() {
  try {
    const respostasPersonalizadas = JSON.parse(fs.readFileSync('respostas.json'));
    return respostasPersonalizadas;
  } catch (error) {
    console.error('Erro ao carregar respostas personalizadas:', error);
    return {};
  }
}

// Inicialize o bot com uma sessão nomeada
venom
  .create('session-name')
  .then((client) => {
    console.log('Bot está pronto! Escaneie o código QR com o WhatsApp no seu celular.');

    const respostasPersonalizadas = carregarRespostasPersonalizadas();

    // Manipular mensagens recebidas
    client.onMessage(async (message) => {
      try {
        const receivedMessage = message.body.toLowerCase();
        const sender = message.from;

        // Verificar se a mensagem recebida corresponde a uma resposta personalizada
        if (respostasPersonalizadas.hasOwnProperty(receivedMessage)) {
          const resposta = respostasPersonalizadas[receivedMessage];
          await client.sendText(sender, resposta);
          console.log('Resposta personalizada enviada com sucesso para', sender);
        } else {
          // Responder com opções predefinidas
          const resposta = `Escolha uma das opções:
          1. Falar com Atendente
          2. Ver Produtos
          3. Bazar
          4. Sair`;
          await client.sendText(sender, resposta);
          console.log('Resposta padrão enviada com sucesso para', sender);
        }
      } catch (error) {
        console.error('Erro ao enviar resposta: ', error);
      }
    });
  })
  .catch((error) => {
    console.error('Erro ao criar a sessão:', error);
  });
