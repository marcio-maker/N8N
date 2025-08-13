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
        link: "https://mercadolivre.com.br/afiliado/shampoo-purificante",
        price: "R$ 59,90",
        coupon: "LISO10",
        benefits: ["Controle de oleosidade", "Fórmula vegana", "Sem sulfatos"]
    },
    "liso-ressecamento": {
        name: "Máscara de Hidratação Intensa",
        description: "Hidratação profunda para cabelos lisos ressecados.",
        image: "https://i.pinimg.com/736x/22/e8/b3/22e8b3b7bde73885e070cc5dbbb37549.jpg",
        link: "https://mercadolivre.com.br/afiliado/mascara-hidratacao",
        price: "R$ 79,90",
        coupon: "HIDRATA15",
        benefits: ["Hidratação profunda", "Repara pontas duplas", "Fórmula nutritiva"]
    },
    "default": {
        name: "Kit Cuidados Básicos",
        description: "Indicado para todos os tipos de cabelo.",
        image: "https://i.pinimg.com/1200x/19/29/0d/19290dfa0438f6d5f73d259d7f235ec3.jpg",
        link: "https://mercadolivre.com.br/afiliado/kit-cuidados",
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

    // Mensagem para WhatsApp com formatação otimizada
    const whatsappMessage = 
`💇 *RECOMENDAÇÃO PERSONALIZADA* 💇

👤 *Para:* ${data.nome}
✨ *Tipo de cabelo:* ${capitalizeFirstLetter(data.tipo_cabelo)}
🔍 *Problema principal:* ${capitalizeFirstLetter(data.problema_cabelo)}
🎯 *Objetivo:* ${capitalizeFirstLetter(data.objetivo)}

━━━━━━━━━━━━━━
🛍️ *PRODUTO RECOMENDADO*
📌 *${product.name}*
${product.description}

${product.benefits.map(b => `✔️ ${b}`).join('\n')}

💵 *Preço especial:* ${product.price}
🎟️ *Cupom exclusivo:* ${product.coupon}

━━━━━━━━━━━━━━
🛒 *COMPRE AGORA:*
${product.link}

_*Digite OK para confirmar recebimento*_`;

    // HTML para exibição no site
    const htmlRecommendation = `
        <div class="recommendation-content">
            <h3>📌 Recomendação Personalizada</h3>
            
            <div class="user-profile">
                <p><strong>👤 Nome:</strong> ${data.nome}</p>
                <p><strong>✨ Tipo de cabelo:</strong> ${capitalizeFirstLetter(data.tipo_cabelo)}</p>
                <p><strong>🔍 Problema principal:</strong> ${capitalizeFirstLetter(data.problema_cabelo)}</p>
                <p><strong>🎯 Objetivo:</strong> ${capitalizeFirstLetter(data.objetivo)}</p>
            </div>
            
            <div class="product-card">
                <h4>${product.name}</h4>
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <p class="product-description">${product.description}</p>
                
                <div class="product-benefits">
                    <h5>✅ Benefícios:</h5>
                    <ul>${benefitsList}</ul>
                </div>
                
                <div class="product-price">
                    <span class="price-tag">💵 ${product.price}</span>
                    <span class="coupon-badge">🎟️ Cupom: ${product.coupon}</span>
                </div>
                
                <a href="${product.link}" class="mercado-livre-btn" target="_blank">
                    <img src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.18.9/mercadolibre/logo__small@2x.png" alt="Mercado Livre" class="ml-logo">
                    Comprar no Mercado Livre
                </a>
            </div>
            
            <a href="https://wa.me/${data.whatsapp}?text=${encodeURIComponent(whatsappMessage)}" class="whatsapp-link" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" alt="WhatsApp" class="whatsapp-icon">
                Receber no WhatsApp
            </a>
        </div>
    `;

    return {
        whatsapp: whatsappMessage,
        html: htmlRecommendation,
        productImage: product.image,
        productLink: product.link
    };
}

// Função auxiliar para capitalizar a primeira letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Gerando recomendação...';

    // Simula tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));

    const recommendation = generateRecommendation(formData);
    recommendationDiv.innerHTML = recommendation.html;
    recommendationDiv.classList.remove('hidden');

    // Mostra mensagem de sucesso com contador
    showMessage('Recomendação gerada com sucesso! Redirecionando para WhatsApp...', 'success');

    // Prepara URL do WhatsApp com metadados para miniatura
    const whatsappUrl = new URL(`https://wa.me/${formData.whatsapp}`);
    whatsappUrl.searchParams.append('text', recommendation.whatsapp);
    
    // Adiciona metadados (funciona em alguns dispositivos)
    whatsappUrl.searchParams.append('image', recommendation.productImage);
    whatsappUrl.searchParams.append('link', recommendation.productLink);
    
    // Abre o WhatsApp após 3 segundos
    setTimeout(() => {
        window.open(whatsappUrl.href, '_blank');
    }, 3000);

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Receber Recomendação';
}

quizForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm();
});