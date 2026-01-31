import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MenuItem from '../components/MenuItem';
import { getMenu } from '../services/api';
import { useCart } from '../context/CartContext';
import '../styles/MenuPage.css';

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { cart } = useCart();

  const categories = ['All', 'Pizza', 'Burgers', 'Drinks', 'Desserts'];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await getMenu();
        setMenu(res.data);
      } catch (err) {
        console.error('Failed to load menu', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // 🔥 VERY IMPORTANT — prevents lag
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchCategory =
        category === 'All' || item.category === category;

      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [menu, category, search]);

  if (loading) return <p className="center">Loading menu...</p>;

  return (
    <div className="container">
      <header className="header">
        <h1>🍕 Food Menu</h1>

        <Link to="/cart" className="cart-link">
          Cart ({cartCount})
        </Link>
      </header>

      <input
        type="text"
        className="search"
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={category === cat ? 'active' : ''}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid">
        {filteredMenu.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
