import React, { useEffect, useState, useCallback, useImperativeHandle } from "react";
import "./userssection.scss";

const UsersSection = React.forwardRef((props, ref) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [nextUrl, setNextUrl] = useState(null);

  // Для тултіпа
  const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });

  const fetchUsers = useCallback(async (page, reset = false) => {
    try {
      const res = await fetch(
        `https://frontend-test-assignment-api.abz.agency/api/v1/users?page=${page}&count=6`
      );
      const data = await res.json();
      if (data.success) {
        setUsers((prevUsers) => {
          if (reset) return data.users;
          const allUsers = [...prevUsers, ...data.users];
          return Array.from(new Map(allUsers.map((u) => [u.id, u])).values());
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

  useImperativeHandle(ref, () => ({
    reload: () => {
      setPage(1);
      fetchUsers(1, true);
    },
  }), [fetchUsers]);

  const handleShowMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  // Обробники для тултіпа
  const handleMouseMove = (e, email) => {
    setTooltip({
      visible: true,
      text: email,
      x: e.clientX + 10, // трохи правіше від курсору
      y: e.clientY + 20, // трохи нижче від курсору
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  return (
    <section id="users-section" className="users-section">
      <div className="headtitle">
        <h1>Working with GET request</h1>
      </div>
      <div className="users-grid">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <img className="photo" src={user.photo} alt={user.name} />
            <p className="name">{user.name}</p>
            <div className="userdetails">
              <p
                className="email"
                onMouseMove={(e) => handleMouseMove(e, user.email)}
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

      {/* Кастомний тултіп */}
      {tooltip.visible && (
        <div
          className="custom-tooltip"
          style={{ top: tooltip.y, left: tooltip.x, position: "fixed" }}
        >
          {tooltip.text}
        </div>
      )}
    </section>
  );
});

export default React.memo(UsersSection);
