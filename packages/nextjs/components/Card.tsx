interface CardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  onBuyNowClicked?: (id: string) => void;
}

export default function Card({ id, title, description, price, onBuyNowClicked, isBuyButtonLoading }: CardProps) {
  const buyNowClickHandler = () => {
    onBuyNowClicked && onBuyNowClicked(id);
  };
  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <figure>
        <img src="https://picsum.photos/400/130/?blur" alt="Food" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <button
            className={`btn btn-primary btn-sm ${isBuyButtonLoading ? "loading" : ""}`}
            onClick={buyNowClickHandler}
          >
            Buy Now For {price}
          </button>
        </div>
      </div>
    </div>
  );
}
