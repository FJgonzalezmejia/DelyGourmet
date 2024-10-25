let cart = JSON.parse(localStorage.getItem('cart')) || []; // Cargar carrito desde localStorage
let isQrGenerated = false; // Controla si el QR ya fue generado

// Función para generar el contenido del QR con los productos, cantidades y el total
function generateQrContent(cartItems) {
    let total = 0;
    let cartContent = cartItems.map(item => {
        let subtotal = item.price * item.quantity;
        total += subtotal;
        return `Producto: ${item.name}, Cantidad: ${item.quantity}, Subtotal: Q${subtotal}`;
    }).join('\n');
    return `${cartContent}\nTotal: Q${total}`;
}

// Evento para generar el QR, descargarlo como imagen y crear el PDF
document.getElementById("checkout-button").addEventListener("click", function() {
    if (isQrGenerated) {
        alert("Ya se generó un código QR para este pedido. No se puede generar nuevamente.");
        return;
    }

    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Generar el contenido del QR
    let qrContent = generateQrContent(cart);

    // Crear el código QR
    let qrCode = new QRCode(document.getElementById("qrcode"), {
        text: qrContent,
        width: 256,
        height: 256,
    });

    // Espera un momento para que se genere el QR antes de capturarlo como imagen
    setTimeout(() => {
        // Usar html2canvas para convertir el QR a imagen
        html2canvas(document.getElementById("qrcode")).then(canvas => {
            let qrImage = canvas.toDataURL("image/png");

            // Crear el PDF
            const { jsPDF } = window.jspdf;
            let doc = new jsPDF();

            // Agregar información del carrito
            let yPosition = 10;
            doc.setFontSize(12);
            cart.forEach(item => {
                doc.text(`Producto: ${item.name} | Cantidad: ${item.quantity} | Precio: Q${item.price}`, 10, yPosition);
                yPosition += 10;
            });

            // Calcular el total
            let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            doc.text(`Total: Q${total.toFixed(2)}`, 10, yPosition + 10);

            // Agregar el código QR
            doc.addImage(qrImage, 'PNG', 10, yPosition + 20, 50, 50);

            // Descargar el PDF
            doc.save('factura.pdf');

            // Marcar como QR generado para evitar generar múltiples códigos
            isQrGenerated = true;
        });

        alert("Factura generada con éxito. Puedes descargarla en PDF.");
    }, 500); // 500ms para asegurar que el QR está generado
});

// Actualiza el total mostrado en el carrito
function updateCartTotal() {
    let total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById("cart-total").innerText = `Total: Q${total.toFixed(2)}`;
}

// Función para cargar el carrito desde localStorage
function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartTable.innerHTML = ''; // Limpiar la tabla

    let total = 0;

    cart.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>Q${product.price.toFixed(2)}</td>
            <td>
                ${product.quantity > 1 
                    ? `<button onclick="decreaseQuantity(${index})">-</button>` 
                    : ''
                }
                ${product.quantity}
                <button onclick="increaseQuantity(${index})">+</button>
            </td>
            <td>Q${(product.price * product.quantity).toFixed(2)}</td>
            <td><button class="removeButton" onclick="removeFromCart(${index})">Eliminar</button></td>
        `;

        cartTable.appendChild(row);
        total += product.price * product.quantity;
    });

    cartTotal.innerText = `Total: Q${total.toFixed(2)}`;
    updateCartCount(cart); // Actualizar el contador de productos
}

// Función para contar productos en el carrito
function updateCartCount(cart) {
    const cartCountElement = document.getElementById('cart-count');
    const totalCount = cart.reduce((sum, product) => sum + product.quantity, 0);
    cartCountElement.innerText = totalCount; // Actualizar el contador en el HTML
}

// Función para aumentar la cantidad de un producto
window.increaseQuantity = function(index) {
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Función para disminuir la cantidad de un producto
window.decreaseQuantity = function(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1); // Si la cantidad es 1, eliminar el producto
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Función para eliminar productos del carrito
window.removeFromCart = function(index) {
    cart.splice(index, 1); // Eliminar producto por índice
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Cargar el carrito al cargar la página
loadCart();
updateCartTotal();
