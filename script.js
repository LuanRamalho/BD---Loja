// Carregar produtos do banco de dados JSON ao inicializar
document.addEventListener('DOMContentLoaded', loadProducts);

document.getElementById('LojaForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const productName = document.getElementById('productName').value;
  const productPrice = parseFloat(document.getElementById('productPrice').value).toFixed(2);
  
  if (productName && productPrice) {
    const product = {
      name: productName,
      price: productPrice
    };

    // Adicionar produto � tabela
    addProductToTable(product);

    // Salvar produto no banco de dados JSON
    saveProductToDB(product);

    // Limpar os campos de entrada
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
  }
});

// Fun��o para adicionar produto � tabela
function addProductToTable(product, index = null) {
  const tableBody = document.querySelector('#productTable tbody');
  
  const newRow = document.createElement('tr');
  
  const nameCell = document.createElement('td');
  nameCell.textContent = product.name;
  newRow.appendChild(nameCell);
  
  const priceCell = document.createElement('td');
  priceCell.textContent = `R$ ${product.price}`;
  newRow.appendChild(priceCell);
  
  // Criar as c�lulas de a��o (editar e excluir)
  const actionCell = document.createElement('td');
  actionCell.classList.add('action-buttons');
  
  const editButton = document.createElement('button');
  editButton.textContent = 'Editar';
  editButton.classList.add('edit-btn');
  editButton.addEventListener('click', () => editProduct(index, product));
  
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir';
  deleteButton.classList.add('delete-btn');
  deleteButton.addEventListener('click', () => deleteProduct(index));
  
  actionCell.appendChild(editButton);
  actionCell.appendChild(deleteButton);
  newRow.appendChild(actionCell);
  
  tableBody.appendChild(newRow);
}

// Fun��o para salvar o produto no "banco de dados" JSON (localStorage)
function saveProductToDB(product) {
  let products = JSON.parse(localStorage.getItem('Loja_Produto')) || [];
  products.push(product);
  localStorage.setItem('Loja_Produto', JSON.stringify(products));
  loadProducts();
}

// Fun��o para carregar os produtos salvos e exibir na tabela
function loadProducts() {
  const products = JSON.parse(localStorage.getItem('Loja_Produto')) || [];
  const tableBody = document.querySelector('#productTable tbody');
  tableBody.innerHTML = ''; // Limpar a tabela
  
  products.forEach((product, index) => {
    addProductToTable(product, index);
  });
}

// Fun��o para buscar e filtrar os produtos na tabela
function searchProducts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const tableRows = document.querySelectorAll('#productTable tbody tr');
  
  tableRows.forEach(row => {
    const productName = row.cells[0].textContent.toLowerCase();
    const productPrice = row.cells[1].textContent.replace('R$ ', '').toLowerCase();
    
    // Verifica se o termo de busca corresponde ao nome ou ao pre�o do produto
    if (productName.includes(searchTerm) || productPrice.includes(searchTerm)) {
      row.style.display = ''; // Mostrar linha
    } else {
      row.style.display = 'none'; // Esconder linha
    }
  });
}

// Fun��o para editar um produto diretamente na tabela
function editProduct(index) {
  const tableRow = document.querySelectorAll('#productTable tbody tr')[index];
  const nameCell = tableRow.cells[0];
  const priceCell = tableRow.cells[1];

  // Tornar as c�lulas edit�veis
  nameCell.contentEditable = "true";
  priceCell.contentEditable = "true";
  
  // Alterar o estilo para indicar que est� em modo de edi��o
  nameCell.style.backgroundColor = "#ffffcc";
  priceCell.style.backgroundColor = "#ffffcc";
  
  // Substituir o bot�o "Editar" por um bot�o "Salvar"
  const actionCell = tableRow.cells[2];
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Salvar';
  saveButton.classList.add('edit-btn');
  
  // Adicionar evento de clique ao bot�o "Salvar"
  saveButton.addEventListener('click', () => {
    // Obter os novos valores editados
    const newName = nameCell.textContent.trim();
    const newPrice = parseFloat(priceCell.textContent.trim().replace('R$ ', '')).toFixed(2);
    
    // Validar os valores editados
    if (newName && !isNaN(newPrice)) {
      // Atualizar os produtos no localStorage
      let products = JSON.parse(localStorage.getItem('Loja_Produto')) || [];
      products[index] = { name: newName, price: newPrice };
      localStorage.setItem('Loja_Produto', JSON.stringify(products));

      // Tornar as c�lulas n�o-edit�veis novamente
      nameCell.contentEditable = "false";
      priceCell.contentEditable = "false";
      
      // Restaurar o estilo original
      nameCell.style.backgroundColor = "";
      priceCell.style.backgroundColor = "";

      // Atualizar o conte�do das c�lulas
      nameCell.textContent = newName;
      priceCell.textContent = `R$ ${newPrice}`;
      
      // Substituir o bot�o "Salvar" de volta para "Editar"
      actionCell.removeChild(saveButton);
      actionCell.appendChild(createEditButton(index));
      actionCell.appendChild(createDeleteButton(index));
    } else {
      alert('Por favor, insira valores v�lidos para o nome e o pre�o.');
    }
  });

  // Limpar a c�lula de a��es e inserir o bot�o "Salvar"
  actionCell.innerHTML = '';
  actionCell.appendChild(saveButton);
}

// Fun��o auxiliar para criar o bot�o "Editar"
function createEditButton(index) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Editar';
  editButton.classList.add('edit-btn');
  editButton.addEventListener('click', () => editProduct(index));
  return editButton;
}

// Fun��o auxiliar para criar o bot�o "Excluir"
function createDeleteButton(index) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir';
  deleteButton.classList.add('delete-btn');
  deleteButton.addEventListener('click', () => deleteProduct(index));
  return deleteButton;
}


// Fun��o para excluir um produto
function deleteProduct(index) {
  let products = JSON.parse(localStorage.getItem('Loja_Produto')) || [];
  
  // Remover o produto com base no �ndice
  products.splice(index, 1);
  
  // Atualizar o banco de dados JSON
  localStorage.setItem('Loja_Produto', JSON.stringify(products));
  
  // Recarregar os produtos na tabela
  loadProducts();
}
