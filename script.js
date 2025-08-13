/* =========================
   CONFIGURAÇÕES INICIAIS
========================= */
let currentStep = 1;
const totalSteps = 4;
let attempts = 0;
const maxAttempts = 3;

// Elementos do DOM
const progressBar = document.getElementById('progressBar');
const whatsappField = document.getElementById('whatsapp');
const submitBtn = document.getElementById('submitBtn');
const messageDiv = document.getElementById('message');
const recommendationDiv = document.getElementById('recommendation');
const quizForm = document.getElementById('quizForm');

/* =========================
   EVENTOS INICIAIS
========================= */
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();

    // Permitir apenas números no WhatsApp
    whatsappField.addEventListener('input', () => {
        whatsappField.value = whatsappField.value.replace(/\D/g, '');
    });

    // Permitir apenas letras no nome
    document.getElementById('nome').addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    });

    // Impedir envio com Enter
    quizForm.addEventListener('keypress', e => {
        if (e.key === 'Enter') e.preventDefault();
    });
});

/* =========================
   FUNÇÕES DE NAVEGAÇÃO
========================= */
function updateProgress() {
    progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
}

function nextStep(step) {
    if (!validateStep(step)) {
        attempts++;
        if (attempts >= maxAttempts) {
            showMessage('Você atingiu o limite de tentativas. Recarregue a página.', 'error');
        }
        return;
    }
    attempts = 0;
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
    hideMessage();
}

function prevStep() {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
    hideMessage();
}

/* =========================
   VALIDAÇÃO
========================= */
function validateStep(step) {
    switch(step) {
        case 1:
            const nome = document.getElementById('nome').value.trim();
            const whatsapp = whatsappField.value.trim();
            if (!nome || nome.length < 3) {
                showMessage('Digite seu nome completo', 'error');
                return false;
            }
            if (!whatsapp.startsWith('55') || whatsapp.length < 11) {
                showMessage('Digite um WhatsApp válido (DDI 55)', 'error');
                return false;
            }
            return true;
        case 2:
            if (!document.getElementById('tipo_cabelo').value) {
                showMessage('Selecione seu tipo de cabelo', 'error');
                return false;
            }
            return true;
        case 3:
            if (!document.getElementById('problema_cabelo').value) {
                showMessage('Selecione o problema do cabelo', 'error');
                return false;
            }
            return true;
        default:
            return true;
    }
}

/* =========================
   MENSAGENS
========================= */
function showMessage(text, type) {
    messageDiv.innerHTML = `<div class="${type}">${text}</div>`;
    messageDiv.classList.remove('hidden');
}

function hideMessage() {
    messageDiv.classList.add('hidden');
}

/* =========================
   BANCO DE PRODUTOS
========================= */
const productDatabase = {
    "liso-oleosidade": {
        name: "Shampoo Purificante para Cabelos Lisos",
        description: "Controla a oleosidade sem ressecar, perfeito para cabelos lisos que ficam oleosos rapidamente.",
        image: "https://i.pinimg.com/736x/b6/9d/60/b69d600cc9b8529d179188b44466089b.jpg",
        link: "https://mercadolivre.com.br/afiliado/shampoo-purificante", // Link de afiliado
        price: "R$ 59,90",
        coupon: "LISO10",
        benefits: ["Controle de oleosidade", "Fórmula vegana", "Sem sulfatos"]
    },
    "liso-ressecamento": {
        name: "Máscara de Hidratação Intensa",
        description: "Hidratação profunda para cabelos lisos ressecados.",
        image: "https://i.pinimg.com/736x/22/e8/b3/22e8b3b7bde73885e070cc5dbbb37549.jpg",
        link: "https://mercadolivre.com.br/afiliado/mascara-hidratacao", // Link de afiliado
        price: "R$ 79,90",
        coupon: "HIDRATA15",
        benefits: ["Hidratação profunda", "Repara pontas duplas", "Fórmula nutritiva"]
    },
    "default": {
        name: "Kit Cuidados Básicos",
        description: "Indicado para todos os tipos de cabelo.",
        image: "https://i.pinimg.com/1200x/19/29/0d/19290dfa0438f6d5f73d259d7f235ec3.jpg",
        link: "https://mercadolivre.com.br/afiliado/kit-cuidados", // Link de afiliado
        price: "R$ 69,90",
        coupon: "CABELO5",
        benefits: ["Limpeza suave", "Uso diário", "Para todos os tipos"]
    }
};

/* =========================
   RECOMENDAÇÃO
========================= */
function generateRecommendation(data) {
    const productKey = `${data.tipo_cabelo}-${data.problema_cabelo}`;
    const product = productDatabase[productKey] || productDatabase['default'];

    const benefitsList = product.benefits.map(b => `<li>${b}</li>`).join('');

    // Mensagem detalhada para WhatsApp
    const whatsappMessage =
`💇‍♀️ *Recomendação Personalizada para ${data.nome}*

📋 *Seu Perfil Capilar:*
- Tipo: ${data.tipo_cabelo.charAt(0).toUpperCase() + data.tipo_cabelo.slice(1)}
- Problema: ${data.problema_cabelo.charAt(0).toUpperCase() + data.problema_cabelo.slice(1)}
- Objetivo: ${data.objetivo.charAt(0).toUpperCase() + data.objetivo.slice(1)}

🛍️ *Produto Recomendado:*
${product.name}

📝 *Descrição:*
${product.description}

💲 *Preço:* ${product.price}
🏷️ *Cupom de Desconto:* ${product.coupon}

🔗 *Compre agora no Mercado Livre:* ${product.link}`;

    const htmlRecommendation = `
        <h3>Sua Recomendação</h3>
        <div class="product-card">
            <h4>${product.name}</h4>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
            <ul>${benefitsList}</ul>
            <p><strong>${product.price}</strong></p>
            <div class="coupon-badge">Cupom: ${product.coupon}</div>
            <a href="${product.link}" class="btn mercado-livre-btn" target="_blank">
                <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__small@2x.png" alt="Mercado Livre" class="ml-logo">
                Comprar no Mercado Livre
            </a>
        </div>
        <a href="https://wa.me/${data.whatsapp}?text=${encodeURIComponent(whatsappMessage)}" class="whatsapp-link" target="_blank">📩 Abrir no WhatsApp</a>
    `;
    return { whatsapp: whatsappMessage, html: htmlRecommendation };
}

/* =========================
   ENVIO DO FORMULÁRIO
========================= */
async function submitForm() {
    const formData = {
        nome: document.getElementById('nome').value.trim(),
        whatsapp: whatsappField.value.trim(),
        tipo_cabelo: document.getElementById('tipo_cabelo').value,
        problema_cabelo: document.getElementById('problema_cabelo').value,
        objetivo: document.getElementById('objetivo').value
    };

    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !formData.objetivo) {
        showMessage('Preencha todos os campos corretamente', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Gerando recomendação...';

    await new Promise(resolve => setTimeout(resolve, 1500));

    const recommendation = generateRecommendation(formData);
    recommendationDiv.innerHTML = recommendation.html;
    recommendationDiv.classList.remove('hidden');

    showMessage('Recomendação enviada para seu WhatsApp!', 'success');

    // Abre automaticamente o WhatsApp com mensagem detalhada
    window.open(
        `https://wa.me/${formData.whatsapp}?text=${encodeURIComponent(recommendation.whatsapp)}`,
        '_blank'
    );

    submitBtn.disabled = false;
    submitBtn.textContent = 'Receber Recomendação';
}

quizForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm();
});