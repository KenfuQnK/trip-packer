import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Edit2, GripVertical, Plus, Trash2 } from "lucide-react";

import { getCategoryColorClasses } from "../utils/constants";

const DESKTOP_BREAKPOINT = "(min-width: 1024px)";
const LONG_PRESS_MS = 1000;
const MOVE_TOLERANCE = 8;
const AUTO_SCROLL_EDGE = 96;
const AUTO_SCROLL_SPEED = 18;

function buildItemsByCategory(categories, items, activeDrag, dropTarget) {
  const groups = Object.fromEntries(
    categories.map((category) => [
      category.id,
      items
        .filter((item) => item.categoryId === category.id)
        .sort((first, second) => (first.order || 0) - (second.order || 0)),
    ]),
  );

  if (!activeDrag || !dropTarget) {
    return groups;
  }

  Object.keys(groups).forEach((categoryId) => {
    groups[categoryId] = groups[categoryId].filter((item) => item.id !== activeDrag.item.id);
  });

  const nextTargetItems = [...(groups[dropTarget.categoryId] || [])];
  const safeIndex = Math.max(0, Math.min(dropTarget.index, nextTargetItems.length));

  nextTargetItems.splice(safeIndex, 0, {
    ...activeDrag.item,
    categoryId: dropTarget.categoryId,
    isDragPlaceholder: true,
  });
  groups[dropTarget.categoryId] = nextTargetItems;

  return groups;
}

export default function ConfigView({ actions, categories, items, setView, theme }) {
  const [isWideScreen, setIsWideScreen] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_BREAKPOINT).matches : false,
  );
  const [dragState, setDragState] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [longPressItemId, setLongPressItemId] = useState(null);

  const scrollRef = useRef(null);
  const dragStateRef = useRef(null);
  const dropTargetRef = useRef(null);
  const longPressRef = useRef(null);
  const categoryListRefs = useRef(new Map());
  const itemRefs = useRef(new Map());
  const autoScrollFrameRef = useRef(null);
  const categoriesRef = useRef(categories);
  const itemsByCategoryRef = useRef(null);
  const actionsRef = useRef(actions);

  function clearPendingLongPressListeners() {
    if (longPressRef.current?.cleanup) {
      longPressRef.current.cleanup();
    }
  }

  const itemsByCategory = useMemo(
    () => buildItemsByCategory(categories, items, dragState, dropTarget),
    [categories, items, dragState, dropTarget],
  );

  useEffect(() => {
    categoriesRef.current = categories;
  }, [categories]);

  useEffect(() => {
    itemsByCategoryRef.current = itemsByCategory;
  }, [itemsByCategory]);

  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  function setCategoryListRef(categoryId, node) {
    if (node) {
      categoryListRefs.current.set(categoryId, node);
    } else {
      categoryListRefs.current.delete(categoryId);
    }
  }

  function setItemRef(itemId, node) {
    if (node) {
      itemRefs.current.set(itemId, node);
    } else {
      itemRefs.current.delete(itemId);
    }
  }

  function cancelPendingLongPress() {
    if (longPressRef.current?.timerId) {
      window.clearTimeout(longPressRef.current.timerId);
    }

    clearPendingLongPressListeners();

    longPressRef.current = null;
    setLongPressItemId(null);
  }

  function startDrag(item, point, node) {
    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const sourceCategoryItems = items
      .filter((entry) => entry.categoryId === item.categoryId)
      .sort((first, second) => (first.order || 0) - (second.order || 0));
    const sourceIndex = sourceCategoryItems.findIndex((entry) => entry.id === item.id);

    if (sourceIndex === -1) {
      return;
    }

    setDragState({
      item,
      point,
      offsetX: point.x - rect.left,
      offsetY: point.y - rect.top,
      width: rect.width,
      height: rect.height,
    });
    setDropTarget({
      categoryId: item.categoryId,
      index: sourceIndex,
    });
    setLongPressItemId(null);
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);
    const handleChange = (event) => {
      setIsWideScreen(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  useEffect(() => {
    dropTargetRef.current = dropTarget;
  }, [dropTarget]);

  useEffect(() => {
    return () => {
      if (longPressRef.current?.timerId) {
        window.clearTimeout(longPressRef.current.timerId);
      }

      longPressRef.current = null;
      setLongPressItemId(null);

      if (autoScrollFrameRef.current) {
        window.cancelAnimationFrame(autoScrollFrameRef.current);
        autoScrollFrameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!dragState) {
      return undefined;
    }

    const updateDropTarget = (clientX, clientY, activeItemId) => {
      let resolvedCategoryId = null;

      for (const category of categoriesRef.current) {
        const listNode = categoryListRefs.current.get(category.id);

        if (!listNode) {
          continue;
        }

        const rect = listNode.getBoundingClientRect();
        const withinHorizontalBounds = clientX >= rect.left && clientX <= rect.right;
        const withinVerticalBounds = clientY >= rect.top - 24 && clientY <= rect.bottom + 24;

        if (withinHorizontalBounds && withinVerticalBounds) {
          resolvedCategoryId = category.id;
          break;
        }
      }

      if (!resolvedCategoryId) {
        return;
      }

      const visibleItems = (itemsByCategoryRef.current[resolvedCategoryId] || []).filter(
        (entry) => !entry.isDragPlaceholder && entry.id !== activeItemId,
      );

      let nextIndex = visibleItems.length;

      for (let index = 0; index < visibleItems.length; index += 1) {
        const node = itemRefs.current.get(visibleItems[index].id);

        if (!node) {
          continue;
        }

        const rect = node.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (clientY < midpoint) {
          nextIndex = index;
          break;
        }
      }

      setDropTarget((current) => {
        if (current?.categoryId === resolvedCategoryId && current.index === nextIndex) {
          return current;
        }

        return {
          categoryId: resolvedCategoryId,
          index: nextIndex,
        };
      });
    };

    const stepAutoScroll = () => {
      const activeDrag = dragStateRef.current;
      const scrollContainer = scrollRef.current;

      if (!activeDrag || !scrollContainer) {
        autoScrollFrameRef.current = null;
        return;
      }

      const rect = scrollContainer.getBoundingClientRect();
      const threshold = Math.min(AUTO_SCROLL_EDGE, rect.height / 4);
      let delta = 0;

      if (activeDrag.point.y < rect.top + threshold) {
        delta = -((rect.top + threshold - activeDrag.point.y) / threshold) * AUTO_SCROLL_SPEED;
      } else if (activeDrag.point.y > rect.bottom - threshold) {
        delta = ((activeDrag.point.y - (rect.bottom - threshold)) / threshold) * AUTO_SCROLL_SPEED;
      }

      if (delta !== 0) {
        scrollContainer.scrollTop += delta;
        updateDropTarget(activeDrag.point.x, activeDrag.point.y, activeDrag.item.id);
      }

      autoScrollFrameRef.current = window.requestAnimationFrame(stepAutoScroll);
    };

    const startAutoScroll = () => {
      if (autoScrollFrameRef.current) {
        return;
      }

      autoScrollFrameRef.current = window.requestAnimationFrame(stepAutoScroll);
    };

    const stopAutoScroll = () => {
      if (!autoScrollFrameRef.current) {
        return;
      }

      window.cancelAnimationFrame(autoScrollFrameRef.current);
      autoScrollFrameRef.current = null;
    };

    const finishDrag = () => {
      const activeDrag = dragStateRef.current;
      const target = dropTargetRef.current;

      if (!activeDrag || !target) {
        setDragState(null);
        setDropTarget(null);
        setLongPressItemId(null);

        if (longPressRef.current?.timerId) {
          window.clearTimeout(longPressRef.current.timerId);
        }
        longPressRef.current = null;
        return;
      }

      actionsRef.current.reorderItem(activeDrag.item.id, target.categoryId, target.index);
      setDragState(null);
      setDropTarget(null);
      setLongPressItemId(null);

      if (longPressRef.current?.timerId) {
        window.clearTimeout(longPressRef.current.timerId);
      }
      longPressRef.current = null;
    };

    const cancelDrag = () => {
      setDragState(null);
      setDropTarget(null);
      setLongPressItemId(null);

      if (longPressRef.current?.timerId) {
        window.clearTimeout(longPressRef.current.timerId);
      }
      longPressRef.current = null;
    };

    const handlePointerMove = (event) => {
      event.preventDefault();
      const nextPoint = { x: event.clientX, y: event.clientY };

      setDragState((current) => (current ? { ...current, point: nextPoint } : current));
      updateDropTarget(nextPoint.x, nextPoint.y, dragState.item.id);
    };

    const handlePointerUp = () => {
      finishDrag();
    };

    const handlePointerCancel = () => {
      cancelDrag();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);

    startAutoScroll();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
      stopAutoScroll();
    };
  }, [dragState]);

  function handleDesktopHandlePointerDown(item, event) {
    if (!isWideScreen || event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    startDrag(item, { x: event.clientX, y: event.clientY }, itemRefs.current.get(item.id));
  }

  function handleMobileLongPressStart(item, event) {
    if (isWideScreen || event.pointerType === "mouse" || event.button !== 0) {
      return;
    }

    if (event.target.closest("[data-no-drag='true']")) {
      return;
    }

    cancelPendingLongPress();

    const pointerId = event.pointerId;
    const handleWindowPointerMove = (moveEvent) => {
      if (moveEvent.pointerId !== pointerId || dragStateRef.current) {
        return;
      }

      const pendingLongPress = longPressRef.current;

      if (!pendingLongPress) {
        return;
      }

      const movedX = moveEvent.clientX - pendingLongPress.startX;
      const movedY = moveEvent.clientY - pendingLongPress.startY;
      const distance = Math.hypot(movedX, movedY);

      if (distance > MOVE_TOLERANCE) {
        cancelPendingLongPress();
      }
    };
    const handleWindowPointerEnd = (endEvent) => {
      if (endEvent.pointerId !== pointerId || dragStateRef.current) {
        return;
      }

      cancelPendingLongPress();
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerEnd);
      window.removeEventListener("pointercancel", handleWindowPointerEnd);
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", handleWindowPointerEnd);
    window.addEventListener("pointercancel", handleWindowPointerEnd);

    const nextState = {
      item,
      pointerId,
      startX: event.clientX,
      startY: event.clientY,
      cleanup,
      timerId: window.setTimeout(() => {
        clearPendingLongPressListeners();
        startDrag(
          item,
          { x: nextState.startX, y: nextState.startY },
          itemRefs.current.get(item.id),
        );
        longPressRef.current = null;
      }, LONG_PRESS_MS),
    };

    longPressRef.current = nextState;
    setLongPressItemId(item.id);
    event.preventDefault();
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-4 pt-6 pb-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex w-full items-center">
          <button
            onClick={() => setView("home")}
            className="-ml-2 mr-3 cursor-pointer rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-slate-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-slate-200"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            Configuracion
          </h2>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
          {categories.map((category) => {
            const categoryItems = itemsByCategory[category.id] || [];
            const isActiveDropCategory = dropTarget?.categoryId === category.id;

            return (
              <div
                key={category.id}
                className={`mb-6 break-inside-avoid rounded-3xl border bg-white p-3 shadow-sm transition-all duration-200 dark:bg-slate-900 dark:shadow-none ${
                  isActiveDropCategory
                    ? "border-indigo-200 shadow-lg shadow-indigo-100/70 dark:border-indigo-500/40 dark:shadow-indigo-950/40"
                    : "border-slate-100 dark:border-slate-800"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3
                    className={`rounded-xl px-3 py-1.5 text-sm font-bold ${getCategoryColorClasses(category.color, "chip", theme)}`}
                  >
                    {category.name}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      data-no-drag="true"
                      onClick={() => actions.editCategory(category)}
                      className="cursor-pointer rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-indigo-300"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      data-no-drag="true"
                      onClick={() => actions.deleteCategory(category)}
                      className="cursor-pointer rounded-full bg-slate-50 p-2 text-slate-400 transition-colors hover:text-red-500 dark:bg-slate-800 dark:text-slate-500 dark:hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div
                  ref={(node) => setCategoryListRef(category.id, node)}
                  className={`space-y-2 rounded-3xl transition-colors ${
                    isActiveDropCategory ? "bg-indigo-50/60 dark:bg-indigo-500/10" : ""
                  }`}
                >
                  {categoryItems.length === 0 && (
                    <div
                      className={`rounded-2xl border-2 border-dashed px-4 py-6 text-center text-sm font-medium transition-all ${
                        isActiveDropCategory
                          ? "border-indigo-300 bg-indigo-50 text-indigo-600 dark:border-indigo-400/50 dark:bg-indigo-500/10 dark:text-indigo-200"
                          : "border-slate-200 text-slate-400 dark:border-slate-700 dark:text-slate-500"
                      }`}
                    >
                      Suelta aqui para mover el item a esta categoria
                    </div>
                  )}

                  {categoryItems.map((item) => {
                    if (item.isDragPlaceholder) {
                      return (
                        <div
                          key={`placeholder-${item.id}`}
                          className="rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-100/80 px-4 py-4 shadow-sm transition-all duration-200 dark:border-indigo-400/50 dark:bg-indigo-500/10 dark:shadow-none"
                        >
                          <div className="flex items-center gap-3 text-sm font-semibold text-indigo-700 dark:text-indigo-200">
                            <GripVertical size={16} className="shrink-0 opacity-60" />
                            <span className="truncate">{item.name || "Separador"}</span>
                          </div>
                        </div>
                      );
                    }

                    const isSeparator = item.type === "separator";
                    const label = item.name || "Separador";
                    const isLongPressArmed = longPressItemId === item.id && !dragState;

                    return (
                      <div
                        key={item.id}
                        ref={(node) => setItemRef(item.id, node)}
                        onPointerDown={(event) => handleMobileLongPressStart(item, event)}
                        onContextMenu={(event) => event.preventDefault()}
                        onDragStart={(event) => event.preventDefault()}
                        className={`flex items-center justify-between rounded-2xl border p-2 pl-4 transition-all duration-200 ${
                          isSeparator
                            ? "border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-800"
                            : "border-slate-100/50 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70"
                        } ${isLongPressArmed ? "scale-[0.99] shadow-md shadow-indigo-100 dark:shadow-indigo-950/50" : ""} select-none`}
                        style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
                      >
                        <span
                          className={`mr-2 truncate font-medium ${
                            isSeparator ? "text-slate-500 dark:text-slate-400" : "text-slate-700 dark:text-slate-200"
                          } select-none`}
                          style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
                        >
                          {isSeparator && (
                            <span className="block text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                              SEPARADOR
                            </span>
                          )}
                          {label}
                        </span>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            aria-label={`Mover ${label}`}
                            onPointerDown={(event) => handleDesktopHandlePointerDown(item, event)}
                            className="hidden cursor-grab rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 active:cursor-grabbing dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:flex"
                          >
                            <GripVertical size={18} />
                          </button>
                          <button
                            data-no-drag="true"
                            onClick={() => actions.editItem(item)}
                            className="cursor-pointer p-2 text-slate-400 transition-colors hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-300"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            data-no-drag="true"
                            onClick={() => actions.deleteItem(item)}
                            className="cursor-pointer p-2 text-slate-400 transition-colors hover:text-red-500 dark:text-slate-500 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="grid gap-2 pt-1">
                    <button
                      data-no-drag="true"
                      className="cursor-pointer mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                      onClick={() => actions.addItem(category.id)}
                    >
                      <Plus size={18} /> Anadir item
                    </button>
                    <button
                      data-no-drag="true"
                      className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      onClick={() => actions.addSeparator(category.id)}
                    >
                      <Plus size={18} /> Anadir separador
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="cursor-pointer flex w-full max-w-sm items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 py-4 font-bold text-indigo-600 transition-all active:scale-95 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
            onClick={actions.addCategory}
          >
            <Plus size={20} /> Nueva categoria
          </button>
        </div>
      </div>

      {dragState && (
        <div
          className="pointer-events-none fixed z-40"
          style={{
            left: dragState.point.x - dragState.offsetX,
            top: dragState.point.y - dragState.offsetY,
            width: dragState.width,
          }}
        >
          <div className="rotate-[1deg] scale-[1.02] rounded-2xl border border-indigo-200 bg-white/95 p-2 pl-4 shadow-2xl shadow-indigo-200/60 backdrop-blur-sm dark:border-indigo-400/30 dark:bg-slate-900/95 dark:shadow-indigo-950/50">
            <div className="flex items-center justify-between">
              <span
                className={`mr-2 truncate font-medium ${
                  dragState.item.type === "separator"
                    ? "text-slate-500 dark:text-slate-400"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {dragState.item.type === "separator" && (
                  <span className="block text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    SEPARADOR
                  </span>
                )}
                {dragState.item.name || "Separador"}
              </span>
              <GripVertical size={18} className="shrink-0 text-indigo-400 dark:text-indigo-300" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
