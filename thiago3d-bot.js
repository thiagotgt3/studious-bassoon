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

venom.create({ session: 'session-name', useChrome: true })
  .then((client) => {
    const respostasPersonalizadas = carregarRespostasPersonalizadas();

    client.onMessage(async (message) => {
      try {
        const receivedMessage = message.body.toLowerCase();
        const sender = message.from;

        // Verificar se a mensagem recebida corresponde a uma resposta personalizada
        if (respostasPersonalizadas.hasOwnProperty(receivedMessage)) {
          const resposta = respostasPersonalizadas[receivedMessage];
          await client.sendText(sender, resposta);
        } else {
          // Responder com 3 opções predefinidas
          const resposta = `Escolha uma das opções:
          1. Falar com Atendente
          2. Ver Produtos
          3. Bazar
          4. Sair`;
          await client.sendText(sender, resposta);
        }

        console.log('Resposta enviada com sucesso para', sender);
      } catch (error) {
        console.error('Erro ao enviar resposta: ', error);
      }
    });
  })
  .catch((error) => {
    console.error('Erro ao criar a sessão:', error);
  });


