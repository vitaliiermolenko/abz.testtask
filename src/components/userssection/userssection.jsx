import React, {
  useEffect,
  useState,
  useCallback,
  useImperativeHandle
} from "react";
import "./userssection.scss";

const UsersSection = React.forwardRef((props, ref) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);

  // Стан тултіпа
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0
  });

  const fetchUsers = useCallback(async (page, reset = false) => {
    try {
      const res = await fetch(
        `https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${page}&count=6`
      );
      const data = await res.json();
      if (data.success) {
        setUsers(prev => {
          const merged = reset ? data.users : [...prev, ...data.users];
          // Унікальні користувачі за id
          return Array.from(new Map(merged.map(u => [u.id, u])).values());
        });
        setNextUrl(data.links.next_url);
      }
    } catch (err) {
      console.error("Помилка при завантаженні користувачів:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  useImperativeHandle(
    ref,
    () => ({
      reload: () => {
        setPage(1);
        fetchUsers(1, true);
      }
    }),
    [fetchUsers]
  );

  const handleShowMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  // Обробники тултіпа
  const handleMouseMove = useCallback((e, text) => {
    setTooltip({
      visible: true,
      text,
      x: e.clientX + 10,
      y: e.clientY + 20
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  }, []);

  return (
    <section id="users-section" className="users-section">
      <div className="headtitle">
        <h1>Working with GET request</h1>
      </div>

      <div className="users-grid">
        {users.map(user => (
          <div className="user-card" key={user.id}>
            <img className="photo" src={user.photo} alt={user.name} />
            <p className="name">{user.name}</p>
            <div className="userdetails">
              <p
                className="email"
                onMouseMove={e => handleMouseMove(e, user.email)}
                onMouseLeave={handleMouseLeave}
              >
                {user.email}
              </p>
              <p className="phone">{user.phone}</p>
              <p className="position">{user.position}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleShowMore}
        disabled={!nextUrl}
        className={!nextUrl ? "disabled" : ""}
      >
        Show more
      </button>

      {tooltip.visible && (
        <div
          className="custom-tooltip"
          style={{
            top: tooltip.y,
            left: tooltip.x
          }}
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
});

export default React.memo(UsersSection);
