"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiEdit2,
  FiMail,
  FiPlus,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUserCheck,
  FiUserMinus,
} from "react-icons/fi";
import {
  createUser,
  deleteUser,
  fetchUsers,
  toggleUserActive,
  updateUser,
  type ApiUser,
} from "../../services/admin-api";

type Role = ApiUser["role"];

type UserForm = {
  full_name: string;
  email: string;
  role: Role;
  password: string;
  is_active: boolean;
};

const roleLabels: Record<Role, string> = {
  OWNER: "مالك",
  MANAGER: "مدير",
  STAFF: "موظف",
};

const getInitials = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) {
    return "م";
  }
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]).join("");
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function UsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<UserForm>({
    full_name: "",
    email: "",
    role: "STAFF",
    password: "",
    is_active: true,
  });

  useEffect(() => {
    const load = async () => {
      setLoadError(null);
      const data = await fetchUsers();
      if (!data) {
        setLoadError("تعذر تحميل المستخدمين من الباك. تأكد من الاتصال والتوكن.");
        setUsers([]);
        return;
      }
      setUsers(data);
    };
    load();
  }, []);

  const roleOptions = useMemo(() => {
    return Array.from(new Set(users.map((user) => user.role)));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? user.is_active : !user.is_active);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      if (!matchesStatus || !matchesRole) {
        return false;
      }
      if (!trimmed) {
        return true;
      }
      return (
        user.full_name.toLowerCase().includes(trimmed) ||
        user.email.toLowerCase().includes(trimmed)
      );
    });
  }, [users, statusFilter, roleFilter, search]);

  const summary = useMemo(() => {
    const total = users.length;
    const active = users.filter((user) => user.is_active).length;
    const owners = users.filter((user) => user.role === "OWNER").length;
    const inactive = total - active;
    return { total, active, owners, inactive };
  }, [users]);

  const summaryCards = [
    {
      title: "إجمالي المستخدمين",
      value: String(summary.total),
      tone: "bg-emerald-50 text-emerald-600",
      icon: <FiShield />,
    },
    {
      title: "المستخدمون النشطون",
      value: String(summary.active),
      tone: "bg-emerald-50 text-emerald-600",
      icon: <FiUserCheck />,
    },
    {
      title: "المالكون",
      value: String(summary.owners),
      tone: "bg-slate-100 text-slate-700",
      icon: <FiUserCheck />,
    },
    {
      title: "المستخدمون غير النشطين",
      value: String(summary.inactive),
      tone: "bg-rose-50 text-rose-600",
      icon: <FiUserMinus />,
    },
  ];

  const resetForm = () => {
    setForm({
      full_name: "",
      email: "",
      role: "STAFF",
      password: "",
      is_active: true,
    });
  };

  const toggleActive = async (user: ApiUser) => {
    setActionError(null);
    try {
      const updated = await toggleUserActive(user.id);
      setUsers((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر تحديث حالة المستخدم.";
      setActionError(message);
    }
  };

  const handleSaveUser = async () => {
    if (!form.full_name.trim() || !form.email.trim()) {
      setActionError("أدخل الاسم والبريد الإلكتروني.");
      return;
    }

    setActionError(null);
    try {
      if (editingId !== null) {
        const updated = await updateUser(editingId, {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          role: form.role,
          is_active: form.is_active,
        });
        setUsers((prev) =>
          prev.map((user) => (user.id === updated.id ? updated : user))
        );
      } else {
        if (!form.password.trim()) {
          setActionError("أدخل كلمة مرور للمستخدم الجديد.");
          return;
        }
        const created = await createUser({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          role: form.role,
          password: form.password,
          is_active: form.is_active,
        });
        setUsers((prev) => [created, ...prev]);
      }

      resetForm();
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر حفظ المستخدم.";
      setActionError(message);
    }
  };

  const handleEdit = (user: ApiUser) => {
    setEditingId(user.id);
    setForm({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password: "",
      is_active: user.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setActionError(null);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر حذف المستخدم.";
      setActionError(message);
    }
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
            resetForm();
            setShowForm((prev) => !prev);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <FiPlus />
          إضافة مستخدم جديد
        </button>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {loadError}
        </div>
      ) : null}

      {showForm ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="block text-right text-sm text-slate-600">
              الاسم
              <input
                type="text"
                value={form.full_name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, full_name: event.target.value }))
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
              الدور
              <select
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    role: event.target.value as Role,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="OWNER">مالك</option>
                <option value="MANAGER">مدير</option>
                <option value="STAFF">موظف</option>
              </select>
            </label>
            {editingId === null ? (
              <label className="block text-right text-sm text-slate-600">
                كلمة المرور
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
                />
              </label>
            ) : null}
          </div>

          <label className="mt-4 flex items-center gap-3 text-sm text-slate-600">
            <span>نشط</span>
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, is_active: !prev.is_active }))
              }
              aria-pressed={form.is_active}
              className={`relative h-6 w-11 rounded-full ${
                form.is_active ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                  form.is_active ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </label>

          {actionError ? (
            <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-right text-sm text-rose-600">
              {actionError}
            </div>
          ) : null}

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
              onClick={handleSaveUser}
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
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | "active" | "inactive"
                )
              }
              className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-700"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as "all" | Role)
              }
              className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-700"
            >
              <option value="all">جميع الأدوار</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
          <FiSearch />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث عن مستخدم..."
            className="w-56 bg-transparent text-right outline-none"
          />
        </div>
      </div>

      {actionError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {actionError}
        </div>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">قائمة المستخدمين</h2>
        </div>

        <div className="grid grid-cols-[1.4fr_1.4fr_1fr_1fr_0.7fr_0.9fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
          <div className="text-center">المستخدم</div>
          <div className="text-center">البريد الإلكتروني</div>
          <div className="text-center">الدور</div>
          <div className="text-center">تاريخ الإنشاء</div>
          <div className="text-center">الحالة</div>
          <div className="text-center">الإجراءات</div>
        </div>

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-[1.4fr_1.4fr_1fr_1fr_0.7fr_0.9fr] items-center border-b border-slate-100 px-5 py-3 text-sm text-slate-700 last:border-b-0"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white">
                {getInitials(user.full_name)}
              </span>
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  {user.full_name}
                </p>
                <p className="text-xs text-slate-400">#{user.id}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-600">{user.email}</span>
              <FiMail className="text-slate-400" />
            </div>

            <div className="flex justify-center">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.role === "OWNER"
                    ? "bg-rose-50 text-rose-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {roleLabels[user.role]}
              </span>
            </div>

            <div className="text-center text-slate-600">
              {formatDateTime(user.created_at)}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => toggleActive(user)}
                className={`relative h-6 w-11 rounded-full transition ${
                  user.is_active ? "bg-emerald-500" : "bg-slate-200"
                }`}
                aria-pressed={user.is_active}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    user.is_active ? "left-5" : "left-0.5"
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

