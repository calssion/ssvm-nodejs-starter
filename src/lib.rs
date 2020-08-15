use std::io::{BufReader, Cursor};
use wasm_bindgen::prelude::*;
use nodejs_helper;
use serde::{Serialize, Deserialize};
use image::{GenericImageView, png, ImageEncoder, ImageFormat};
use image::imageops::FilterType;

#[wasm_bindgen]
pub fn say(s: &str) -> String {
  println!("The Rust function say() received {}", s);
  let r = String::from("hello ");
  return r + s;
}

// #[wasm_bindgen]
// pub fn fetch(url: &str) {
//   let content = nodejs_helper::request::fetch_as_string(url);
//   nodejs_helper::console::log(url);
//   nodejs_helper::console::log(&content);
// }

#[derive(Serialize, Deserialize)]
#[derive(Copy, Clone, Debug)]
pub struct Dimension {
  pub width: u32,
  pub height: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Picture {
  pub dim: Dimension,
  pub raw: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
pub struct User {
  pub id: u32,
  pub full_name: String,
  pub created: String,
}

#[wasm_bindgen]
pub fn resize_file(input: &str) {
  let p: (Dimension, String, String) = serde_json::from_str(input).unwrap();

  nodejs_helper::console::time("Resize file");
  let raw = nodejs_helper::fs::read_file_sync(&p.1);
  nodejs_helper::console::time_log("Resize file", "Done reading");
  let src = Picture {
    dim: p.0,
    raw: raw,
  };
  let target = resize_impl(&src);
  nodejs_helper::console::time_log("Resize file", "Done resizing");

  nodejs_helper::fs::write_file_sync(&p.2, &target.raw);
  nodejs_helper::console::time_log("Resize file", "Done writing");

  nodejs_helper::console::time_end("Resize file");
}

pub fn resize_impl(src: &Picture) -> Picture {
  let cur = Cursor::new(&src.raw);

  let fin = BufReader::new(cur);

  // load the `image::DynamicImage`
  let mut img = image::load(fin, ImageFormat::Png).unwrap();

  // Resize the img in the memory.
  img = img.resize_to_fill(src.dim.width, src.dim.height, FilterType::Lanczos3);

  let (w, h) = img.dimensions();

  // Write the resized image to the vector.
  let mut cur: Cursor<Vec<u8>>  = Cursor::new(vec![]);
  png::PNGEncoder::new(&mut cur).write_image(&img.to_bytes(), w, h, img.color()).unwrap();

  let dim = Dimension {
    width: w,
    height: h,
  };

  Picture {
    dim,
    raw: cur.into_inner(),
  }
}