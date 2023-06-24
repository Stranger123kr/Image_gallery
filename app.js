const api_key = "H7KKJdfwgRTFmX6Xv5AkctNMBWi8Z3zwE9MHKovzogBFPc53XfbWQelq ";
let perPage = 9;
let currentPage = 1;
let scrolling = -800;
let search_img = null;

const imagesWrapper = document.querySelector(".images");
const load_more = document.querySelector(".load_more");
const scroll_top_up = document.querySelector("#scroll_top_up");
const search_box = document.querySelector(".search_box input");
const end_page = document.querySelector("#end");
const light_box = document.querySelector(".light_box");
const close_btn = document.querySelector(".uil-times");
const downloaded_img = document.querySelector(".uil-import");

// -------------- This is a function for download images form api -----------------

const downloading = async (img_url, img_info) => {
  try {
    await fetch(img_url)
      .then((res) => res.blob())
      .then((file) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = img_info;
        link.click();
      });
  } catch (error) {
    console.log(`Got some error when getting a image! ${error}`);
  }
};

// ====================== this is a function of light_box =================

const Show_lightbox = (img, name) => {
  // showing light box content
  light_box.classList.add("show");
  light_box.querySelector("img").src = img;
  downloaded_img.setAttribute("data-img", img);
  downloaded_img.setAttribute("data-name", name);
  light_box.querySelector("span").innerText = name;
  document.body.style.overflow = "hidden";
};

const hide_lightbox = () => {
  light_box.classList.remove("show");
  document.body.style.overflow = "auto";
};

// ====================== this is a function for iterate for very images and other details  =================
const Generate_HTML = (images) => {
  // making li of all fetched images and adding them to the existing image warper
  if (images.length === 0) {
    end_page.classList.add("show");
    load_more.style.display = "none";
  } else {
    images.forEach((img) => {
      imagesWrapper.innerHTML += `<li class="card" onclick="Show_lightbox('${img.src.large2x}','${img.photographer}')">
      <img src=${img.src.large2x} loading='lazy' alt="img">
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloading('${img.src.large2x}','${img.photographer}');event.stopPropagation()">
            <i class="uil uil-import"></i>
          </button>
        </div>
    </li>`;
    });
  }
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
    console.log(`Got some error when fetching a data form api! ${error}`);
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

  const endOf_the_page =
    window.innerHeight + window.pageYOffset >=
    document.body.offsetHeight + scrolling;

  if (endOf_the_page) {
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

// =================== this close btn of light_box ==============
close_btn.addEventListener("click", hide_lightbox);
downloaded_img.addEventListener("click", (e) =>
  downloading(e.target.dataset.img, e.target.dataset.name)
);
