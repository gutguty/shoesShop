function showErrorMessage(message) {
  const main = document.querySelector("[data-js-catalog-main]")
  const msg = `
        <div class="error">
            <p>${message}</p>       
        </div>
    `
  main.insertAdjacentHTML("afterend", msg)
}

function showErrorMessageForm(message, step) {
  const existErrors = document.querySelectorAll(".error")
  existErrors.forEach((error) => {
    error.remove()
  })
  const main = document.querySelector(`[data-js-step${step + 1}]`)
  const msg = `
        <div class="error">
            <p style="color: red">${message}</p>       
        </div>
    `
  main.insertAdjacentHTML("afterbegin", msg)
}

// Получение id из LS
function getBucketLocalStorage() {
  const bucket = localStorage.getItem("bucket")
  return bucket ? JSON.parse(bucket) : []
}

// Запись id товаров в LS
function setBucketLocalStorage(bucket) {
  const bucketCount = document.querySelector("[data-js-header-bucket-count]")
  localStorage.setItem("bucket", JSON.stringify(bucket))
  bucketCount.textContent = bucket.length
}

// Проверка, существует ли товар указанный в LS
//(если например пару дней не заходил юзер, а товар, который у него в корзине, уже не существует)
function checkBucketValue(productsData) {
  const bucket = getBucketLocalStorage()

  bucket.forEach((bucketID, index) => {
    const existsInProducts = productsData.some(
      (item) => item.id === Number(bucketID),
    )
    if (!existsInProducts) {
      bucket.splice(index, 1)
    }
  })

  setBucketLocalStorage(bucket)
}

export {
  showErrorMessage,
  getBucketLocalStorage,
  setBucketLocalStorage,
  checkBucketValue,
  showErrorMessageForm,
}
