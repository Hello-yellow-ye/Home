// بيانات المنتجات
const products = [
    {
        id: 1,
        name: "منتج 1",
        price: 320,
        images: ["img/1.png","d/1/1.jpg","d/1/2.jpg","d/1/3.jpg"],
        description: "",
        sizes: ["38"]
    },
    {
        id: 2,
        name: "منتج 2",
        price: 320,
        images: ["img/2.png","d/2/1.jpg","d/2/2.jpg","d/2/3.jpg"],
        description: "",
        sizes: ["40"]
    },
    {
        id: 3,
        name: "منتج 3",
        price: 320,
        images: ["img/3.png", ,"d/3/1.jpg","d/3/2.jpg","d/3/3.jpg"],
        description: "",
        sizes: ["42"]
    },
    {
        id: 4,
        name: "منتج 4",
        price: 300,
        images: ["img/4.png", ,"d/4/1.jpg","d/4/2.jpg","d/4/3.jpg"],
        description: "",
        sizes: ["38","40","42","44"]
    },
    {
        id: 5,
        name: "منتج 5",
        price: 200,
        images: ["img/5.png", ,"d/5/1.jpg","d/5/2.jpg","d/5/3.jpg"],
        description: "",
        sizes: ["36"]
    },
    {
        id: 6,
        name: "منتج 6",
        price: 170,
        images: ["img/6.png", ,"d/6/1.jpg","d/6/2.jpg","d/6/3.jpg","d/6/4.jpg"],
        description: "",
        sizes: ["38","40"]
    },
    {
        id: 7,
        name: "منتج 7",
        price: 135,
        images: ["img/7.png", ,"d/7/1.jpg","d/7/2.jpg"],
        description: "",
        sizes: ["38","40"]
    },
    {
        id: 8,
        name: "منتج 8",
        price: 170,
        images: ["img/8.png", ,"d/8/1.jpg","d/8/2.jpg","d/8/3.jpg"],
        description: "",
        sizes: ["38","40"]
    },
    {
        id: 9,
        name: "منتج 9",
        price: 170,
        images: ["img/9.png", ,"d/9/1.jpg","d/9/2.jpg","d/9/3.jpg"],
        description: "",
        sizes: ["38","40"]
    },
    {
        id: 10,
        name: "منتج 10",
        price: 310,
        images: ["img/10.png", ,"d/10/1.jpg","d/10/2.jpg","d/10/3.jpg"],
        description: "",
        sizes: ["40"]
    },
    {
        id: 11,
        name: "منتج 11",
        price: 210,
        images: ["img/11.png", ,"d/11/1.jpg","d/11/2.jpg","d/11/3.jpg"],
        description: "",
        sizes: ["36","38","40","42"]
    },
    {
        id: 12,
        name: "منتج 12",
        price: 210,
        images: ["img/12.png", ,"d/12/1.jpg","d/12/2.jpg","d/12/3.jpg"],
        description: "",
        sizes: ["38","40","42"]
    }
];

// أكواد الخصم
const discountCodes = [
    { code: "10HE", type: "percentage", value: 5, condition: { minProducts: 2 }, expiryDate: "2025-03-21T23:59:59" },
    
    { code: "05HE", type: "percentage", value: 4, condition: { minTotal: 150 }, expiryDate: "2025-03-21T23:59:59" }, 
      // 
];

// السلة
let cart = [];

// متغير لتخزين كود الخصم المستخدم
let appliedDiscountCode = null;

// عرض المنتجات
function displayProducts() {
    const productsContainer = document.querySelector('.products');
    if (!productsContainer) return; // تأكد من وجود العنصر
    productsContainer.innerHTML = '';
    products.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product" onclick="openProductModal(${product.id})">
                <img src="${product.images[0]}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} $</p>
            </div>
        `;
    });
}

// فتح نافذة تفاصيل المنتج
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return; // تأكد من وجود المنتج
    const modalContent = document.querySelector('.product-details');
    if (!modalContent) return; // تأكد من وجود العنصر
    modalContent.innerHTML = `
        <div class="main-image">
            <img id="main-product-image" src="${product.images[0]}">
        </div>
        <div class="thumbnail-images">
            ${product.images.map((img, index) => `
                <img src="${img}" alt="صورة ${index + 1}" onclick="changeMainImage('${img}')" ${index === 0 ? 'class="active"' : ''}>
            `).join('')}
        </div>
        <p id="product-description">${product.description}</p>
        <p id="product-price">${product.price} $</p>
        <select id="size">
            ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
        </select>
        <button onclick="addToCart(${product.id})">إضافة إلى السلة</button>
    `;
    document.getElementById('product-modal').style.display = 'flex';
}

// تغيير الصورة الرئيسية
function changeMainImage(src) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) mainImage.src = src; // تأكد من وجود العنصر
    document.querySelectorAll('.thumbnail-images img').forEach(img => img.classList.remove('active'));
    event.target.classList.add('active');
}

// إضافة المنتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return; // تأكد من وجود المنتج
    const size = document.getElementById('size').value;
    const existingProduct = cart.find(item => item.id === productId && item.size === size);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, size, quantity: 1 });
    }

    updateCartDisplay();
    closeModal();
}

// تحديث عرض السلة
function updateCartDisplay() {
    const cartTableBody = document.querySelector('#cart-table tbody');
    const totalPriceElement = document.getElementById('total-price');
    const finalPriceElement = document.getElementById('final-price');
    const cartCountElement = document.getElementById('cart-count');
    if (!cartTableBody || !totalPriceElement || !finalPriceElement || !cartCountElement) return; // تأكد من وجود العناصر

    cartTableBody.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        cartTableBody.innerHTML += `
            <tr>
                <td>${item.name} (${item.size})</td>
                <td>${item.price} ريال</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>${itemTotal} ريال</td>
                <td><button onclick="removeFromCart(${index})">إزالة</button></td>
            </tr>
        `;
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
    finalPriceElement.textContent = totalPrice.toFixed(2);
    cartCountElement.textContent = cart.length;
}

// تحديث الكمية
function updateQuantity(index, quantity) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity = parseInt(quantity);
        updateCartDisplay();
    }
}

// حذف المنتج من السلة
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
}

// فتح نافذة السلة
function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.style.display = 'flex'; // تأكد من وجود العنصر
}

// إغلاق النوافذ المنبثقة
function closeModal() {
    const productModal = document.getElementById('product-modal');
    if (productModal) productModal.style.display = 'none'; // تأكد من وجود العنصر
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) cartModal.style.display = 'none'; // تأكد من وجود العنصر
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.style.display = 'none'; // تأكد من وجود العنصر
}

// تطبيق الخصم
function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value.trim();
    const totalPrice = parseFloat(document.getElementById('total-price').textContent);
    let finalPrice = totalPrice;

    // البحث عن كود الخصم
    const discount = discountCodes.find(dc => dc.code === discountCode);

    if (discount) {
        let isValid = true;
        let conditionMessage = "";

        // التحقق من تاريخ انتهاء الصلاحية
        const currentDate = new Date(); // التاريخ والوقت الحاليين
        const expiryDate = new Date(discount.expiryDate); // تحويل expiryDate إلى كائن Date

        if (currentDate > expiryDate) {
            isValid = false;
            conditionMessage = `عذرًا، كود الخصم "${discount.code}" انتهت صلاحيته في ${formatDate(expiryDate)}.`;
        }

        // التحقق من الشروط إذا كان الخصم مشروطًا
        if (discount.condition && isValid) {
            if (discount.condition.minProducts && cart.length < discount.condition.minProducts) {
                isValid = false;
                conditionMessage = `هذا الكود يتطلب شراء ${discount.condition.minProducts} منتجات أو أكثر.`;
            }
            if (discount.condition.minTotal && totalPrice < discount.condition.minTotal) {
                isValid = false;
                conditionMessage = `هذا الكود يتطلب أن يكون إجمالي السلة ${discount.condition.minTotal} ريال أو أكثر.`;
            }
        }

        // تطبيق الخصم إذا كان الكود صالحًا
        if (isValid) {
            if (discount.type === "percentage" || discount.type === "conditional-percentage") {
                finalPrice -= totalPrice * (discount.value / 100); // خصم نسبة مئوية
            } else if (discount.type === "fixed" || discount.type === "conditional-fixed") {
                finalPrice -= discount.value; // خصم ثابت
            }
            appliedDiscountCode = discount.code; // تخزين الكود المستخدم
            alert(`تم تطبيق كود الخصم "${discount.code}" بنجاح!\nتم تطبيق خصم بقيمة: ${discount.value}${discount.type.includes("percentage") ? "%" : " ريال"}`);
        } else {
            appliedDiscountCode = null; // إعادة تعيين المتغير إذا كان الكود غير صالح
            alert(`عذرًا، لا يمكن تطبيق كود الخصم "${discount.code}".\n${conditionMessage}`);
        }
    } else if (discountCode) {
        appliedDiscountCode = null; // إعادة تعيين المتغير إذا كان الكود غير صحيح
        alert("عذرًا، كود الخصم غير صحيح.");
    }

    // تحديث السعر النهائي
    document.getElementById('final-price').textContent = finalPrice.toFixed(2);
}

// دالة مساعدة لتنسيق التاريخ
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleDateString('ar-SA', options);
}

// فتح نافذة إتمام الشراء
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("السلة فارغة. يرجى إضافة منتجات قبل إتمام الشراء.");
        return;
    }

    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) checkoutModal.style.display = 'flex'; // تأكد من وجود العنصر
}

// إرسال الطلب إلى Telegram
function sendToTelegram(order) {
    const botToken = '7274532719:AAGesLIeEEmif5IUOSLEsXfgl9stjO-49Jk'; // استبدل ببوت توكن الخاص بك
    const chatId = '-4692338086'; // استبدل بمعرف الدردشة الخاص بك

    const message = `
طلب جديد:

${order.products.map(p => `- ${p.name} (${p.size}) | السعر: ${p.price} $ | الكمية: ${p.quantity}`).join('\n \n')}

الإجمالي: ${order.total} $
كود الخصم المستخدم: ${appliedDiscountCode || "لا يوجد"}
الإجمالي بعد الخصم: ${order.finalTotal} ريال
رقم التواصل: ${order.phone}
العنوان: ${order.address}
طريقة التواصل: ${order.contactMethod}
    `;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('تم إرسال الطلب بنجاح:', data);
        alert("تم إرسال طلبك بنجاح! سيتم التواصل معك قريبًا.");
        cart = []; // تفريغ السلة بعد إرسال الطلب
        updateCartDisplay(); // تحديث عرض السلة
        closeCheckoutModal(); // إغلاق نافذة إتمام الشراء
    })
    .catch(error => {
        console.error('حدث خطأ أثناء الإرسال:', error);
        alert("حدث خطأ أثناء إرسال الطلب. يرجى التأكد من اتصالك بالانترنت.");
    });
}

// إرسال الطلب
document.getElementById('checkout-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert("السلة فارغة. يرجى إضافة منتجات قبل إتمام الشراء.");
        return;
    }

    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const contactMethod = document.querySelector('input[name="contact"]:checked')?.value;

    const order = {
        products: cart,
        total: document.getElementById('total-price').textContent,
        finalTotal: document.getElementById('final-price').textContent,
        phone,
        address,
        contactMethod
    };

    sendToTelegram(order);
});


function validatePhone() {
    let input = document.getElementById("phone");
    let errorMessage = document.getElementById("error-message");
    let submitBtn = document.getElementById("submit-btn");
    let value = input.value;

    // استبدال الأرقام العربية بالأرقام الإنجليزية
    value = value.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function (d) {
        return "٠١٢٣٤٥٦٧٨٩".indexOf(d);
    });

    // التحقق من أن الرقم يبدأ بـ 7 أو ٧
    let isValid = value.startsWith("7") || value.startsWith("٧");

    // التحقق من أن الإدخال يتكون من 9 أرقام فقط
    if (!isValid) {
        errorMessage.textContent = "يجب أن يبدأ الرقم بـ 7 أو ٧";
    } else if (value.length !== 9 || isNaN(value)) {
        errorMessage.textContent = "يجب إدخال 9 أرقام فقط";
        isValid = false;
    } else {
        errorMessage.textContent = "";
    }

    // تفعيل أو تعطيل الزر بناءً على صحة الرقم
    submitBtn.disabled = !isValid;
}

// عند الضغط على الزر مع رقم غير صالح، تظهر رسالة تحذير
function handleSubmit() {
    let input = document.getElementById("phone").value;

    if (input.length !== 9 || (!input.startsWith("7") && !input.startsWith("٧"))) {
        alert("⚠️ الرقم غير صالح! يجب أن يبدأ بـ 7 أو ٧ ويكون 9 أرقام فقط.");
    } else {
        setTimeout(function() {
        // لا يوجد طريقة لإغلاق alert عبر الكود مباشرة، ولكن بعد فترة معينة يمكن أن تتابع مع باقي الإجراءات
    }, 2000); // 2000 ملي ثانية = 2 ثانية
    }
}

document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
});

document.addEventListener('touchmove', function (event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });



document.addEventListener("DOMContentLoaded", function () {
    let today = new Date();
    let startDate = new Date(today.getFullYear(), 1, 19); // 19 فبراير
    let endDate = new Date(today.getFullYear(), 1, 21, 23, 59, 59); // 21 فبراير آخر اليوم

    if (today >= startDate && today <= endDate) {
        document.getElementById("discount-popup").style.display = "block";
    }
});

// وظيفة إغلاق الإشعار
function closePopup() {
    document.getElementById("discount-popup").style.display = "none";
}

// وظيفة نسخ كود الخصم
function copyCode(id) {
    let codeText = document.getElementById(id).innerText;
    navigator.clipboard.writeText(codeText).then(() => {
        alert("تم نسخ الكود: " + codeText);
    });
}


// عرض المنتجات عند تحميل الصفحة
window.onload = displayProducts;
