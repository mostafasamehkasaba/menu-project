"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FiChevronDown,
  FiEdit2,
  FiMail,
  FiPhone,
  FiPlus,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUserMinus,
} from "react-icons/fi";

const summaryCards = [
  {
    title: "إجمالي المستخدمين",
    value: "8",
    tone: "bg-emerald-50 text-emerald-600",
    icon: <FiShield />,
  },
  {
    title: "المستخدمون النشطون",
    value: "6",
    tone: "bg-emerald-50 text-emerald-600",
    icon: <FiUserCheck />,
  },
  {
    title: "الأدمن",
    value: "3",
    tone: "bg-slate-100 text-slate-700",
    icon: <FiUserCheck />,
  },
  {
    title: "المستخدمون المعلّقون",
    value: "1",
    tone: "bg-rose-50 text-rose-600",
    icon: <FiUserMinus />,
  },
];

type User = {
  id: number;
  name: string;
  joined: string;
  email: string;
  phone: string;
  role: string;
  lastLogin: string;
  active: boolean;
  avatar: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    name: "أحمد محمد",
    joined: "15-01-2024",
    email: "ahmed@alwaha.com",
    phone: "966+ 123 50 9566",
    role: "مدير النظام",
    lastLogin: "14:30 2026-02-03",
    active: true,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    name: "سارة أحمد",
    joined: "20-03-2024",
    email: "sarah@alwaha.com",
    phone: "966+ 234 55 966",
    role: "مدير",
    lastLogin: "13:15 2026-02-03",
    active: true,
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    name: "خالد عبدالله",
    joined: "10-06-2024",
    email: "khaled@alwaha.com",
    phone: "966+ 345 54 966",
    role: "نادل",
    lastLogin: "12:00 2026-02-03",
    active: true,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=60",
  },
  {
    id: 4,
    name: "فاطمة حسن",
    joined: "05-08-2024",
    email: "fatima@alwaha.com",
    phone: "966+ 456 50 966",
    role: "كاشير",
    lastLogin: "11:30 2026-02-03",
    active: true,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=120&auto=format&fit=crop&q=60&fit=facearea&facepad=2",
  },
  {
    id: 5,
    name: "محمد علي",
    joined: "20-11-2023",
    email: "mohammed@alwaha.com",
    phone: "966+ 567 55 966",
    role: "طباخ",
    lastLogin: "10:00 2026-02-03",
    active: true,
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=120&auto=format&fit=crop&q=60",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "نادل",
  });

  const toggleActive = (id: number) => {
    setUsers((prev: User[]) =>
      prev.map((user: User) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  const handleAddUser = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      return;
    }

    if (editingId !== null) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingId
            ? {
                ...user,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                role: form.role,
              }
            : user
        )
      );
    } else {
      const nextId = users.length
        ? Math.max(...users.map((user) => user.id)) + 1
        : 1;

      setUsers((prev) => [
        {
          id: nextId,
          name: form.name.trim(),
          joined: "03-02-2026",
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
          lastLogin: "-",
          active: true,
          avatar:
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=120&auto=format&fit=crop&q=60&fit=facearea&facepad=2",
        },
        ...prev,
      ]);
    }

    setForm({ name: "", email: "", phone: "", role: "نادل" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">
            إدارة المستخدمين
          </h1>
          <p className="text-sm text-slate-500">
            إدارة حسابات المستخدمين والصلاحيات والأدوار
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm({ name: "", email: "", phone: "", role: "نادل" });
            setShowForm((prev) => !prev);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <FiPlus />
          إضافة مستخدم جديد
        </button>
      </header>

      {showForm ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="block text-right text-sm text-slate-600">
              الاسم
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              البريد الإلكتروني
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الهاتف
              <input
                type="text"
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, phone: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الدور
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, role: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="مدير النظام">مدير النظام</option>
                <option value="مدير">مدير</option>
                <option value="نادل">نادل</option>
                <option value="كاشير">كاشير</option>
                <option value="طباخ">طباخ</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleAddUser}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {editingId !== null ? "حفظ التعديل" : "إضافة المستخدم"}
            </button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-right">
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {card.value}
              </p>
            </div>
            <span
              className={`grid h-11 w-11 place-items-center rounded-2xl ${card.tone}`}
            >
              {card.icon}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            جميع الحالات
            <FiChevronDown className="text-slate-400" />
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            جميع الأدوار
            <FiChevronDown className="text-slate-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
          <FiSearch />
          <input
            type="text"
            placeholder="ابحث عن مستخدم..."
            className="w-56 bg-transparent text-right outline-none"
          />
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">قائمة المستخدمين</h2>
        </div>

        <div className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr_0.7fr_0.9fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
          <div className="text-center">المستخدم</div>
          <div className="text-center">البريد الإلكتروني</div>
          <div className="text-center">الهاتف</div>
          <div className="text-center">الدور</div>
          <div className="text-center">آخر دخول</div>
          <div className="text-center">الحالة</div>
          <div className="text-center">الإجراءات</div>
        </div>

        {users.map((user: User) => (
          <div
            key={user.id}
            className="grid grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr_0.7fr_0.9fr] items-center border-b border-slate-100 px-5 py-3 text-sm text-slate-700 last:border-b-0"
          >
            <div className="flex items-center justify-center gap-3">
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="text-right">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-400">
                  انضم في {user.joined}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-600">{user.email}</span>
              <FiMail className="text-slate-400" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-600">{user.phone}</span>
              <FiPhone className="text-slate-400" />
            </div>

            <div className="flex justify-center">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.role === "مدير النظام"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="text-center text-slate-600">{user.lastLogin}</div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => toggleActive(user.id)}
                className={`relative h-6 w-11 rounded-full transition ${
                  user.active ? "bg-emerald-500" : "bg-slate-200"
                }`}
                aria-pressed={user.active}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    user.active ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-slate-500">
              <button
                type="button"
                onClick={() => handleEdit(user)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200"
              >
                <FiEdit2 />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(user.id)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-rose-500"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
