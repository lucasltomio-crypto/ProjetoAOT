const formReview = document.getElementById("form-review");
const muralReviews = document.getElementById("mural-reviews");

// Carrega os relatórios salvos assim que a página abre
document.addEventListener("DOMContentLoaded", carregarReviews);

formReview.addEventListener("submit", function(event) {
  event.preventDefault();

  // Pega a nota selecionada nos botões do tipo radio
  const notaSelecionada = document.querySelector('input[name="nota"]:checked');

  const novaReview = {
    id: Date.now(), // ID único baseado no tempo atual
    nome: document.getElementById("nome").value.trim(),
    cargo: document.getElementById("cargo").value,
    temporada: document.getElementById("temporada").value,
    nota: notaSelecionada ? notaSelecionada.value : "1",
    comentario: document.getElementById("review").value.trim()
  };

  salvarReview(novaReview);
  formReview.reset();
});

function salvarReview(review) {
  // 1. Busca as reviews existentes ou inicia um array vazio
  const dadosSalvos = localStorage.getItem("aot_reviews");
  const listaReviews = dadosSalvos ? JSON.parse(dadosSalvos) : [];

  // 2. Adiciona a nova review no topo
  listaReviews.unshift(review);

  // 3. Salva no LocalStorage
  localStorage.setItem("aot_reviews", JSON.stringify(listaReviews));

  // 4. Atualiza a tela
  renderizarReviews(listaReviews);
}

function carregarReviews() {
  const dadosSalvos = localStorage.getItem("aot_reviews");
  const listaReviews = dadosSalvos ? JSON.parse(dadosSalvos) : [];
  renderizarReviews(listaReviews);
}

function renderizarReviews(reviews) {
  muralReviews.innerHTML = "";

  if (reviews.length === 0) {
    muralReviews.innerHTML = "<p style='color: #aaa; text-align: center;'>Nenhum relatório enviado ainda.</p>";
    return;
  }

  reviews.forEach(item => {
    const card = document.createElement("div");
    card.style.cssText = `
      background: rgba(22, 22, 35, 0.9);
      border: 1px solid #444;
      border-left: 5px solid #d9534f;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 8px;
      color: #fff;
    `;

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4 style="margin:0; color: #f0a500;">⚔️ ${item.nome} <span style="font-size: 0.8em; color: #aaa;">(${item.cargo})</span></h4>
        <span style="color: #ffc107;">${"★".repeat(item.nota)}</span>
      </div>
      <p style="margin: 8px 0; font-size: 0.9em; color: #ddd;"><strong>Arco:</strong> ${item.temporada}</p>
      <p style="margin: 5px 0; font-style: italic; color: #ccc;">"${item.comentario || "Sem comentários."}"</p>
      <button onclick="excluirReview(${item.id})" style="background: transparent; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-top: 8px; font-size: 0.8em;">🗑️ Excluir Relatório</button>
    `;

    muralReviews.appendChild(card);
  });
}

function excluirReview(id) {
  let listaReviews = JSON.parse(localStorage.getItem("aot_reviews")) || [];
  listaReviews = listaReviews.filter(item => item.id !== id);
  localStorage.setItem("aot_reviews", JSON.stringify(listaReviews));
  renderizarReviews(listaReviews);
}