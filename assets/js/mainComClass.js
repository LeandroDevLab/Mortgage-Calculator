class HipotecaCalculator {
  constructor() {
    // Atributos (pegando os elementos do DOM)
    this.formulario = document.querySelector('#formularioHipoteca');
    this.clearButton = document.querySelector('.limpar');
    this.radioOptions = document.querySelectorAll('input[name="escolha"]');
    this.inputsRadio = document.querySelectorAll('.d-input');
    this.mAmount = document.querySelector('.mAmount');
    this.mTermY = document.querySelector('.mTermY');
    this.mTermP = document.querySelector('.mTermP');
    this.displayPre = document.querySelector('.pre-results');
    this.displayPos = document.querySelector('.results');
    this.errorDiv = document.querySelector('.erro');

    this.parcela = document.querySelector('#parcela');
    this.acumulado = document.querySelector('#acumulado');
    this.errorMsg = 'This field is required';

    this.init();
  }

  // Método para calcular a hipoteca
  calcularRepayment() {
    const hipoteca = parseFloat(this.mAmount.value);
    const taxa = parseFloat(this.mTermP.value) / 12 / 100;
    const prazo = parseFloat(this.mTermY.value) * 12;
    const dividendo = taxa * (1 + taxa) ** prazo;
    const divisor = (1 + taxa) ** prazo - 1;
    return hipoteca * (dividendo / divisor);
  }

  calcularInterestOnly() {
    const hipoteca = parseFloat(this.mAmount.value);
    const taxa = parseFloat(this.mTermP.value) / 12 / 100;
    return hipoteca * taxa;
  }

  // Método para limpar os campos
  limparCampos() {
    this.mAmount.value = '';
    this.mTermY.value = '';
    this.mTermP.value = '';
    this.radioOptions.forEach(radio => (radio.checked = false));
    this.limpaEstiloDoRadio();
    this.displayPre.style.display = 'block';
    this.displayPos.style.display = 'none';
    this.limparErro();
  }

  // Método para remover estilo ativo dos radios
  limpaEstiloDoRadio() {
    this.inputsRadio.forEach(cada => {
      cada.classList.remove('radio-active');
    });
  }

  chanceResultsDisplay() {
    this.displayPre.style.display = 'none';
    this.displayPos.style.display = 'block';
  }

  valorFormatado(valor) {
    const valorFormatado = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(valor);

    return valorFormatado;
  }

  createError(campo, msg) {
    const div = document.createElement('div');
    div.innerHTML = msg;
    div.classList.add('error-text');
    campo.insertAdjacentElement('afterend', div);
  }

  limparErro() {
    for (let errorText of this.formulario.querySelectorAll('.error-text')) {
      //console.log(errorText);
      errorText.remove();
    }
  }

  // Método de inicialização (onde adicionamos os eventos)
  init() {
    // Evento de Focus
    document.querySelectorAll('input[type="number"]').forEach(input => {
      const handleFocus = function (add) {
        const divFocus = this.parentElement;
        divFocus.classList.toggle('focusHoverDiv', add);
        divFocus.querySelector('span').classList.toggle('focusHoverSpan', add);
      };
      //Get into focus
      input.addEventListener('focus', function () {
        handleFocus.call(this, true);
      });
      //Get out of focus
      input.addEventListener('blur', function () {
        handleFocus.call(this, false);
      });

      //Mouseenter
      input.addEventListener('mouseenter', function () {
        handleFocus.call(this, true);
      });
      //Mousedown
      input.addEventListener('mouseout', function () {
        handleFocus.call(this, false);
      });
    });

    // Evento de Focus e Hover input Radio
    document.querySelectorAll('.d-input').forEach(div => {
      const inputDaDiv = div.querySelector('input');

      inputDaDiv.addEventListener('focus', function () {
        div.classList.add('focusHoverDiv');
      });
      inputDaDiv.addEventListener('blur', function () {
        div.classList.remove('focusHoverDiv');
      });

      div.addEventListener('mouseenter', function () {
        this.classList.add('focusHoverDiv');
      });
      div.addEventListener('mouseout', function () {
        this.classList.remove('focusHoverDiv');
      });
    });

    // Evento no formulário
    document
      .getElementById('formularioHipoteca')
      .addEventListener('submit', event => {
        event.preventDefault();

        //limpando os erros
        this.limparErro();

        const radioChecked = document.querySelector(
          'input[name="escolha"]:checked'
        );

        this.formulario.querySelectorAll('.vazio').forEach(campo => {
          const parentSpan = campo.parentElement.querySelector('span');

          campo.addEventListener('click', () => {
            campo.parentElement.classList.remove('error-value');
            parentSpan.classList.remove('error-value');
          });

          if (!campo.value) {
            //nesse caso precisei criar o erro não no campo
            //que seria o elemento irmao do input,
            // segundo a função(.insertAdjacentElement),
            //mas sim no irmão do elemento pai (.parentElement)
            this.createError(campo.parentElement, this.errorMsg);
            campo.parentElement.classList.add('error-value');

            //Primeiro eu pego o elemento pai (campo.parentElement),
            //depois o elemento filho (.querySelector('span')), nesse caso o Span
            parentSpan.classList.add('error-value');
          } else {
            campo.parentElement.classList.remove('error-value');
            parentSpan.classList.remove('error-value');
          }
        });

        if (!radioChecked) {
          //console.log('cheguei aqui');
          const mortgageType = document.querySelector('#mortgage-type');
          this.createError(mortgageType, this.errorMsg);
        }

        if (radioChecked.value === 'R') {
          //console.log('R - cheguei aqui');
          this.parcela.innerHTML = this.valorFormatado(
            this.calcularRepayment()
          );
          this.acumulado.innerHTML = this.valorFormatado(
            this.calcularRepayment() * (parseFloat(this.mTermY.value) * 12)
          );
        } else if (radioChecked.value === 'IO') {
          //console.log('IO - cheguei aqui');

          this.parcela.innerHTML = this.valorFormatado(
            this.calcularInterestOnly()
          );

          this.acumulado.innerHTML = this.valorFormatado(
            this.calcularInterestOnly() * (parseFloat(this.mTermY.value) * 12)
          );
        }
        this.chanceResultsDisplay();
        this.clearButton.focus();
      });

    // Evento no botão limpar
    this.clearButton.addEventListener('click', () => this.limparCampos());

    // Evento nos radios para aplicar o estilo ativo
    this.radioOptions.forEach(opcao => {
      opcao.addEventListener('click', () => {
        this.limpaEstiloDoRadio();
        opcao.closest('.d-input').classList.add('radio-active');
      });
    });
  }
}
// Criando a instância da classe
const calculadora = new HipotecaCalculator();
