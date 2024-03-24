const chatInput = document.querySelector(" .chatInput textarea");
const sendChatbtn = document.querySelector(" .chatInput svg");
const chatbox = document.querySelector(" .chatBox");

let userMessage;

//Adicionar mensagem do usuário no chat
const createChatLi = (message, className) => {
  //criação do elemento do <li> com message e className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent =
    className === "outGoing"
      ? `<p>${message}</p>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-robot" viewBox="0 0 16 16">
    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
  </svg><p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

//gerando a resposta do chat com a API da pokeApi
const generateResponse = async (userMessage) => {
  try {
    // Endpoint para obter dados do Pokémon pelo nome
    const pokemonApiUrl = `https://pokeapi.co/api/v2/pokemon/${userMessage.toLowerCase()}`;

    // Consulta a API para obter dados do Pokémon pelo nome
    const pokemonResponse = await fetch(pokemonApiUrl);
    if (!pokemonResponse.ok) {
      const incomingChatLi = createChatLi(
        "Desculpe, ainda estou em construção, então só entendo nomes de pokémons",
        "incoming"
      );
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
    }
    const pokemonData = await pokemonResponse.json();

    // Obtém o ID do Pokémon dos dados recebidos
    const pokemonId = pokemonData.id;
    // descrição
    const abilityUrl = pokemonData.abilities[0].ability.url;
    const abilityResponse = await fetch(abilityUrl);
    const abilityData = await abilityResponse.json();
    const pokemonDescription = abilityData.effect_entries[1].effect;

    // Obtém a URL da imagem do Pokémon
    const GeraImg = (pokemonData) => {
      // Obtém a URL da imagem do Pokémon
      const pokemonImageUrl = pokemonData.sprites.front_default;

      // Criar elemento de imagem e definir o atributo src
      const imgElement = document.createElement("img");
      imgElement.src = pokemonImageUrl;
      return imgElement;
    };

    // Calcula a geração do Pokémon
    const pokemonGeneration = Math.ceil(pokemonId / 151);

    // Obtém os dados completos do Pokémon usando o ID
    const pokemonDetailsUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", "incoming");

    // Adicione a imagem ao <li>
    const imgElement = GeraImg(pokemonData, "pokemon-image");
    chatLi.appendChild(imgElement);

    // Adiciona a mensagem do Pokémon ao chat

    chatLi.appendChild(imgElement);
    chatbox.appendChild(chatLi, "incoming");

    chatbox.appendChild(
      createChatLi(
        `O numero do pokemon ${userMessage}<br/>
        Numero:${pokemonId}<br/>
        Sua descrição: ${pokemonDescription}<br/>
        Sua geração: ${pokemonGeneration}`,
        "incoming"
      )
    );
  } catch (error) {
    console.error(error);
  }
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  //anexar a mensagem do usuário ao chat
  chatbox.appendChild(createChatLi(userMessage, "outGoing"));

  setTimeout(async () => {
    try {
      const incomingChatLi = createChatLi("Pensando...", "incoming");
      chatbox.appendChild(incomingChatLi);

      // Gerar resposta usando a API
      await generateResponse(userMessage);

      // Remover mensagem "Pensando..." após receber a resposta da API
      chatbox.scrollTo(0, chatbox.scrollHeight);
      chatbox.removeChild(incomingChatLi);
    } catch (error) {
      console.error(error);
      // Remover mensagem "Pensando..." se ocorrer um erro na resposta da API
      chatbox.removeChild(incomingChatLi);
    }
  }, 600);
};

sendChatbtn.addEventListener("click", handleChat);
