const formDoador = document.getElementById('form-doador');
if (formDoador) {
    formDoador.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulário de doador enviado');
        const doador = {
            doador: document.getElementById('doador').value,
            endereco: document.getElementById('endereco').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value
        };
        try {
            const response = await fetch('/api/doadores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(doador)
            });
            const result = await response.json();
            console.log('Resposta do servidor (doador):', result);
            alert(result.message);
            e.target.reset();
        } catch (error) {
            console.error('Erro no frontend (doador):', error);
            alert('Erro ao cadastrar doador');
        }
    });
}

const formProduto = document.getElementById('form-produto');
if (formProduto) {
    formProduto.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Formulário de produto enviado');
        const produto = {
            item: document.getElementById('item').value,
            quantidade: parseInt(document.getElementById('quantidade').value),
            valor: parseFloat(document.getElementById('valor').value),
            data_vencimento: document.getElementById('data_vencimento').value || null,
            data_doacao: document.getElementById('data_doacao').value,
            id_doador: parseInt(document.getElementById('id_doador').value)
        };
        try {
            const response = await fetch('/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            });
            const result = await response.json();
            console.log('Resposta do servidor (produto):', result);
            alert(result.message);
            e.target.reset();
        } catch (error) {
            console.error('Erro no frontend (produto):', error);
            alert('Erro ao cadastrar produto');
        }
    });
}

const mostrarEstoque = document.getElementById('mostrar-estoque');
if (mostrarEstoque) {
    mostrarEstoque.addEventListener('click', async () => {
        console.log('Botão Mostrar Estoque clicado');
        try {
            const response = await fetch('/api/estoque');
            const estoque = await response.json();
            console.log('Estoque recebido:', estoque);
            const listaEstoque = document.getElementById('lista-estoque');
            listaEstoque.innerHTML = '';
            estoque.forEach(produto => {
                const div = document.createElement('div');
                div.textContent = `Item: ${produto.item}, Quantidade: ${produto.quantidade}, Valor: R$${produto.valor}, Vencimento: ${produto.data_vencimento || 'N/A'}, Doação: ${produto.data_doacao}, Doador ID: ${produto.id_doador}`;
                listaEstoque.appendChild(div);
            });
        } catch (error) {
            console.error('Erro no frontend (estoque):', error);
            alert('Erro ao exibir estoque');
        }
    });
}

const mostrarDoadores = document.getElementById('mostrar-doadores');
if (mostrarDoadores) {
    mostrarDoadores.addEventListener('click', async () => {
        console.log('Botão Mostrar Doadores clicado');
        try {
            const response = await fetch('/api/doadores');
            const doadores = await response.json();
            console.log('Doadores recebidos:', doadores);
            const listaDoadores = document.getElementById('lista-doadores-container');
            listaDoadores.innerHTML = '';
            doadores.forEach(doador => {
                const div = document.createElement('div');
                div.textContent = `ID: ${doador.id_doador}, Nome: ${doador.doador}, Endereço: ${doador.endereco}, Telefone: ${doador.telefone}, Email: ${doador.email || 'N/A'}`;
                listaDoadores.appendChild(div);
            });
        } catch (error) {
            console.error('Erro no frontend (doadores):', error);
            alert('Erro ao exibir doadores');
        }
    });
}

// Evento para o botão de remover o último produto da pilha
const removerPilha = document.getElementById('remover-pilha');
if (removerPilha) {
    removerPilha.addEventListener('click', async () => {
        console.log('Botão Remover Último Produto (Pilha) clicado');
        try {
            const response = await fetch('/api/produtos/pilha', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            console.log('Resposta do servidor (remover pilha):', result);
            alert(result.message);
        } catch (error) {
            console.error('Erro no frontend (remover pilha):', error);
            alert('Erro ao remover produto da pilha');
        }
    });
}

// Evento para o botão de remover o primeiro produto da fila
const removerFila = document.getElementById('remover-fila');
if (removerFila) {
    removerFila.addEventListener('click', async () => {
        console.log('Botão Remover Primeiro Produto (Fila) clicado');
        try {
            const response = await fetch('/api/produtos/fila', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            console.log('Resposta do servidor (remover fila):', result);
            alert(result.message);
        } catch (error) {
            console.error('Erro no frontend (remover fila):', error);
            alert('Erro ao remover produto da fila');
        }
    });
}