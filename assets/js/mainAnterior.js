const clear = document.querySelector('.limpar');
const radioOption = document.querySelectorAll('input[name="escolha"]');
const radio = document.querySelectorAll('.d-input');
const mAmount = document.querySelector('.mAmount');
const mTermY = document.querySelector('.mTermY');
const mTermP = document.querySelector('.mTermP');

const displayPre = document.querySelector('.pre-results');
const displayPos = document.querySelector('.results');
displayPos.style.display = 'none';



function resultsIO () {
    const hipoteca = parseFloat(mAmount.value);
    const taxa = (parseFloat(mTermP.value) / 12) / 100;
    return hipoteca * taxa; 
}

function resultsR () {
    const hipoteca = parseFloat(mAmount.value);
    const taxa = (parseFloat(mTermP.value) / 12) / 100;
    const prazo = parseFloat(mTermY.value) * 12;
    const dividendo = taxa * ((1 + taxa)**prazo);
    const divisor = (1 + taxa)**prazo -1;
    return hipoteca * (dividendo/divisor)
}

function valorFormatado(valor) {
    const valorFormatado = new Intl.NumberFormat('en-GB', {
        style: 'currency' ,
        currency: 'GBP'
    }).format(valor);
    
    return valorFormatado;
}

// Função que muda o display já com os valores
function chanceResultsDisplay () {
    displayPre.style.display = 'none';
    displayPos.style.display = 'block'; 
}

document.getElementById('formularioHipoteca').addEventListener('submit', (event) => {
    event.preventDefault();
    const parcela = document.querySelector('#parcela');
    const acumulado = document.querySelector('#acumulado');
    const radioChecked = document.querySelector('input[name="escolha"]:checked').value;

    if(!radioChecked) {
        parcela.innerHTML = 'You need select one Mortgage Type';
        acumulado.innerHTML = 'You need select one Mortgage Type';
    }
    if(radioChecked === 'R') {
        parcela.innerHTML = valorFormatado(resultsR());
        acumulado.innerHTML = valorFormatado((resultsR()* (mTermY.value * 12)));
    } else if (radioChecked === 'IO') {
        parcela.innerHTML = valorFormatado(resultsIO());
        acumulado.innerHTML = valorFormatado((resultsIO()* (mTermY.value * 12))); 
    } 
    chanceResultsDisplay();
    
})

//FUNÇÕES DE MANIPULAÇÃO DE DOM

//limpa estilização dos input radio
function limpaEstiloDoRadio () {
    radio.forEach(cada => {
        if(cada.classList.contains('radio-active')) {
            cada.classList.remove('radio-active');
        }
    })
}

//Clear all
function clearForms () {
    mAmount.value = '';
    mTermP.value = '';
    mTermY.value = '';
    radioOption.forEach(radio => radio.checked = false);
    limpaEstiloDoRadio();
    displayPre.style.display = 'block';
    displayPos.style.display = 'none';
}

clear.addEventListener('click', clearForms);

radioOption.forEach(opcao => {
    opcao.addEventListener('click', () => {
    limpaEstiloDoRadio();
    // closest procura elementos pais com o seletor css, nesse caso o .d-input
    opcao.closest('.d-input').classList.add('radio-active'); 
    })
})

