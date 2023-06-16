const api_key = "H7KKJdfwgRTFmX6Xv5AkctNMBWi8Z3zwE9MHKovzogBFPc53XfbWQelq ";
let perPage = 9;
let currentPage = 1;
let scrolling = 800;

const imagesWrapper = document.querySelector(".images");
const load_more = document.querySelector(".load_more");
const scroll_top_up = document.querySelector("#scroll_top_up");

// ====================== this is a function for iterate for very images and other details  =================
const Generate_HTML = (images) => {
  // making li of all fetched images and adding them to the existing image warper
  images.forEach((img) => {
    imagesWrapper.innerHTML += `<li class="card">
  <img src=${img.src.large2x} alt="img">
  <div class="details">
    <div class="photographer">
      <i class="uil uil-camera"></i>
      <span>${img.photographer}</span>
    </div>
    <button><i class="uil uil-import"></i></button>
  </div>
</li>`;
  });
};

// ====================== this is a function for get images form api =================

const GetImages = (api_URL) => {
  load_more.classList.add("disable"); //this is a loader for loading effect
  // Fetching images by api call with authorization header
  fetch(api_URL, {
    headers: { Authorization: api_key },
  })
    .then((res) => res.json())
    .then((data) => {
      load_more.classList.remove("disable"); //this is a loader for loading effect
      Generate_HTML(data.photos);
    });
};

GetImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

// ====================== this is a load more images function  =================

window.addEventListener("scroll", () => {
  window.scrollY > 500 // this is top up page effect for user
    ? (scroll_top_up.style.display = "block")
    : (scroll_top_up.style.display = "none");

  // this is a Infinity scroll effect for get data -----------

  if (
    window.document.documentElement.offsetHeight -
      window.innerHeight -
      scrolling++ <=
    window.scrollY
  ) {
    LoadMore_Images();
  }
});

const LoadMore_Images = () => {
  currentPage++;
  let api_url = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  GetImages(api_url);
};

// ---------------  this is top up page effect event for user

scroll_top_up.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
