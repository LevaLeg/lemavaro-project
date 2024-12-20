import React, { useEffect, useState } from "react";
import s from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProductsByCategory, getSingleProduct } from "../../requests/products";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import ModalSingelImageContainer from "../../components/ModalSingleImageContainer";
import {
  addProductToCartAction,
  updateCartAction,
} from "../../store/reducers/cartReducer";
import backendUrl from "../../config"; //Переменная для удобного переключения между локальным и удаленным бэкендом.
import {
  addProductToFavoritesAction,
  deleteProductFromFavoritesAction,
} from "../../store/reducers/favoritesReducer";
import { getAllCategories } from "../../requests/categories";
import { productsByCategoryReducer } from "../../store/reducers/productsByCategoryReducer";

export default function SingleProductPage() {
  const { id } = useParams();

  const dispatch = useDispatch();

  useEffect(() => dispatch(getSingleProduct(id)), [id]);

  const singleProductState = useSelector((store) => store.singleProduct);

  const categoryId = singleProductState.data.categoryId


  // useEffect(() => dispatch(getAllCategories(categoryId)),[categoryId])
  useEffect(() => {
    if (categoryId) {
      dispatch(getProductsByCategory(categoryId));
    }
  }, [dispatch, categoryId]);
  const productsByCategoryState = useSelector((store) => store.productsByCategory );

  const categoryTitle = productsByCategoryState?.category?.title;
  console.log(categoryTitle);
  


  const { data } = singleProductState || { status: "loading", data: [] };
 
  const { title, price, discont_price, description, image } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  let [count, setCount] = useState(1);
  const incrementCount = () => setCount(++count);
  const decrementCount = () => {
    if (count > 1) {
      setCount(--count);
    }
  };


  const favorit = useSelector((store) => store.favorites);

  // Ищем текущий товар в избранном
  const favoritProduct = favorit.find((product) => product.id === +id);

  const handleToggleFavorite = () => {
    if (favoritProduct) {
      dispatch(deleteProductFromFavoritesAction(+id));
    } else {
      dispatch(
        addProductToFavoritesAction({ id:+id, title, image, price, discont_price })
      );
    }
  };

  const cart = useSelector((state) => state.cart);
  const handleAddToCart = () => {
    const newProduct = cart.find((e) => e.id === id);
    if (newProduct) {
      dispatch(updateCartAction({ id, count: newProduct.count + count }));
    } else {
      dispatch(
        addProductToCartAction({
          id: +id,
          title,
          price,
          discont_price,
          image,
          count,
        })
      );
    }
  };

  return (
    <div className={s.container_single_card}>
  
      <nav className={s.nav_container}>
        <ul className={s.nav_list}>
          <li className={s.item}>
            <Link to={"/"} className={s.link}>
              Main page
            </Link>
          </li>
          <li className={s.item}>
            <Link to={"/categories"} className={s.link}>
              Categories
            </Link>
          </li>
          <li className={s.item}>
          <Link to={`/categories/${categoryTitle}`} className={s.link}>
              {categoryTitle || 'Loading...'}
            </Link>
          </li>
          {data && (
            <li className={s.item}>
              <Link className={s.card_name} to={`/products/${id}`}>
                {data.title}
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <h3 className={s.title_name}>{`${title}`}</h3>

      {/* Блок с изображением продукта */}
      <div className={s.product_details}>
        <div className={s.image_container}>
          <img
            src={`${backendUrl}${image}`} //Получение картинки
            alt={title}
            className={s.image}
            onClick={handleImageClick}
            style={{ cursor: "pointer" }}
          />
          <span className={s.discount_price_img}>
                    -{Math.round(((price - discont_price) / price) * 100)}%
                  </span>
          <ModalSingelImageContainer
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            image={`${backendUrl}${image}`} //Получение картинки
          />
        </div>

        {/* Блок с информацией о продукте и иконка*/}
        <div className={s.inform_container}>
          <div className={s.container_title_and_icons}>
            <Link to={`/products/${id}`} className={s.title_link}>
              <h3 className={s.title}>{`${title}`}</h3>
            </Link>
            <div className={s.icons_container}>
              {favoritProduct ? (
                <IoIosHeart
                  className={s.icon_heart}
                  onClick={handleToggleFavorite}
                  style={{ color: "#92A134" }} // Зелёное сердечко при добавлении в избранное
                />
              ) : (
                <IoIosHeartEmpty
                  className={s.icon_heart}
                  onClick={handleToggleFavorite}
                  style={{ color: "black" }} // Чёрное пустое сердечко
                />
              )}
            </div>
          </div>

          {
            <div className={s.price_container}>
              {discont_price && discont_price < price ? (
                <>
                  <span className={s.price_discounted}>${discont_price}</span>
                  <span className={s.price_original_discounted}>${price}</span>
                  <span className={s.discount_price}>
                    -{Math.round(((price - discont_price) / price) * 100)}%
                  </span>
                </>
              ) : (
                <span className={s.price_original}>${price}</span>
              )}
            </div>
          }

          <div className={s.count_container}>
            <div className={s.count_button_container}>
              <button className={s.count_button} onClick={decrementCount}>
                <AiOutlineMinus className={s.count_minus} />
              </button>

              <p className={s.count_value}>{count}</p>
              {/* Количество товаров */}

              <button className={s.count_button} onClick={incrementCount}>
                <AiOutlinePlus className={s.count_plus} />
              </button>
            </div>

            <button className={s.add_btn} onClick={handleAddToCart}>
              Add to cart
            </button>
          </div>

          {/* Блок с описанием продукта */}
          <div className={s.description_container}>
            <h3 className={s.description}>Description</h3>
            <p className={s.description_text}>{description}</p>
          </div>
          <div className={s.read_more}>
            <h4 className={s.read}> Read more</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
