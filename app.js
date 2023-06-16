const api_key = "H7KKJdfwgRTFmX6Xv5AkctNMBWi8Z3zwE9MHKovzogBFPc53XfbWQelq ";
let perPage = 9;
let currentPage = 1;
let scrolling = 800;
let search_img = null;

const imagesWrapper = document.querySelector(".images");
const load_more = document.querySelector(".load_more");
const scroll_top_up = document.querySelector("#scroll_top_up");
const search_box = document.querySelector(".search_box input");

const downloading = (img_url) => {
  console.log(img_url);
};

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
          <button onclick="downloading('${img.src.large2x}')">
            <i class="uil uil-import"></i>
          </button>
        </div>
    </li>`;
  });
};

// ====================== this is a function for get images form api =================

const GetImages = async (api_URL) => {
  try {
    load_more.classList.add("disable"); //this is a loader for loading effect
    // Fetching images by api call with authorization header
    await fetch(api_URL, {
      headers: { Authorization: api_key },
    })
      .then((res) => res.json())
      .then((data) => {
        Generate_HTML(data.photos);
        load_more.classList.remove("disable"); //this is a loader for loading effect
      });
  } catch (error) {
    console.log("got some error when fetching a data ");
  }
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
  api_url = search_img
    ? `https://api.pexels.com/v1/search?query=${search_img}&page=${currentPage}&per_page=${perPage}`
    : api_url;
  GetImages(api_url);
};

// ---------------  this is top up page effect event for user

scroll_top_up.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ====================== this is a search function for category  =================

const local_search = (e) => {
  // if pressed key enter , update the current page , search
  if (e.key === "Enter") {
    currentPage = 1;
    imagesWrapper.innerHTML = "";
    search_img = e.target.value;
    GetImages(
      `https://api.pexels.com/v1/search?query=${search_img}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

search_box.addEventListener("keyup", local_search);
