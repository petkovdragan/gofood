$(function () {
    $(".handleCategory").hide();
    handleCategory(0);
    updateCart();
    updatePrice();
    });

function updateCart() {
    var items = JSON.parse(localStorage.getItem("cart"));
    $(".shopping-cart").html("<ul></ul>"); //se brsihat site elementi pa se dodavaat povtorno od memorija
    $(items).each(function (index, element) {
        handleAddItem(element);
    })
    updatePrice();
    //add listener to new elements
    $(".icon-remove").click(deleteItem);
}

//poedinecno dodavanje vo kosnica za sekoj produkt
function handleAddItem(item) {
    $(".shopping-cart").append(`<li>
        <div style="display: flex; align-items: center;">
            <div class="itemKey" id="${item.id}"></div>
            <img src="${item.imageUrl}">

            <div class="shopping-cart-wrapper">
                <p> <b>${item.name}</b></p>
                <span class="shopping-cart-ingredients"> ${item.ingredients}</span>
                <span class="badge badge-warning price">${item.price}</span>
            </div>
        </div>
        
        <i class="icon-remove" style="margin-left: 2rem; font-size: 2rem"></i>
    </li>`);
}

function handleCategory(Id) {
    if (Id == 0) {
        $(".categories").show();
        $(".burgerList").hide();
        $(".drinksList").hide();
        $(".saladList").hide();
        $(".frenchFriesList").hide();
        $(".text-helper").text("Pick a category");
        $(".handleCategory").hide();

    }
    else if (Id == 1) {
        $(".categories").hide();
        $(".burgerList").show();
        $(".drinksList").hide();
        $(".saladList").hide();
        $(".frenchFriesList").hide();
        $(".handleCategory").show();
        $(".text-helper").html(`<p>Pick a burger</p>`);
    }

    else if (Id == 2) {
        $(".categories").hide();
        $(".burgerList").hide();
        $(".drinksList").show();
        $(".saladList").hide();
        $(".frenchFriesList").hide();
        $(".handleCategory").show();
        $(".text-helper").html(`<p>Pick a drink</p>`);
    }

    else if (Id == 3) {
        $(".categories").hide();
        $(".burgerList").hide();
        $(".drinksList").hide();
        $(".saladList").show();
        $(".frenchFriesList").hide();
        $(".handleCategory").show();
        $(".text-helper").html(`<p>Pick a salad</p>`);
    }

    else if (Id == 4) {
        $(".categories").hide();
        $(".burgerList").hide();
        $(".drinksList").hide();
        $(".saladList").hide();
        $(".frenchFriesList").show();
        $(".handleCategory").show();
        $(".text-helper").html(`<p>Pick french fries</p>`);
    }


}

function deleteItem(event) {
    event.preventDefault();
    var id = $(this).parents("li").children("div").children(".itemKey").attr("id");

    var items = JSON.parse(localStorage.getItem("cart"));
    
    //praveme nova niza so site elementi koi imat razlicen id od toj sho go briseme
    var newItems = items.filter(function(item){
        return item.id != id;
    })
    
    localStorage.setItem("cart",JSON.stringify(newItems));
    $(this).parents("li").remove();
    updatePrice();
}

$(".icon-remove").click(deleteItem);

function updatePrice() {
    var total = 0;

    $(".price").each(function (index, elem) {
        var num = elem.innerHTML.split('$')[0];
        total += parseFloat(num);
    })

    $(".totalPrice").html(`<p class="lead text-center totalPrice">Total Price: <b>${total}$</b></p>`);
}

function finishOrder(){
    if (JSON.parse(localStorage.getItem("cart")).length == 0){
        Swal.fire({
            type: 'error',
            title: 'The order can not be empty',
            showConfirmButton: true,
          })
    }

    else {
         Swal.fire({
        type: 'success',
        title: 'Your order will be ready for you',
        showConfirmButton: true,
        html: `The total price is <b>${$(".totalPrice b").text()}</b> and your unique order id is <b>${Math.floor(Math.random() * 26) + parseInt(Date.now() / 100000000)}</b>`
      })

    //prazneme od memorija za narednata poracka da ni bide prazna 
    var empty = [];
    localStorage.setItem("cart", JSON.stringify(empty));
    }
   
    updateCart();
    updatePrice();
    handleCategory(0);
}

$(".addToCart").click(function (event) {
    var price = $(this).parents().children("span");
    price = $(price[0]).text();

    var info = $(this).parents().children(".list-item-details").children("p");

    var name = $(info[0]).children("b").html();

    var imageUrl = $(this).parents().children("img")[0];
    imageUrl = $(imageUrl).attr('src');

    //var ingredients = (info.text().split("(")[1]);
   // ingredients = ingredients.slice(0, ingredients.length - 1);

    var ingredients = $($(this).parents().children(".list-item-details").children("p")[1]).children();
    ingredients = $.map(ingredients, function(a){
        if ($(a).prop("checked") == true)
           return $(a).val();
    });


    var itemObject = {
        name: name,
        imageUrl: imageUrl,
        price: price,
        ingredients: ingredients,
        id: Math.floor(Math.random() * 26) + Date.now()
    }

    
   
    updatePrice();

    //cuvanje na kosnickata lokalno vo memorija na browser
    if (localStorage.getItem("cart") === null) {
        var items = [];
        items[0] = itemObject;
        localStorage.setItem("cart", JSON.stringify(items));
        console.log("first time adding order :)");
    } else {
        var items = JSON.parse(localStorage.getItem("cart"));
        items[items.length] = itemObject;
        localStorage.setItem("cart", JSON.stringify(items));
    }

    //add listener na novite elementi
    $(".icon-remove").click(deleteItem);

    updateCart();

});