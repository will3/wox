export enum Key {
    Left = "Left",
    Right = "Right",
    ZoomIn = "ZoomIn",
    ZoomOut = "ZoomOut",
}

export const keymap = {
    [Key.Left]: new Set(["a", "left"]),
    [Key.Right]: new Set(["d", "right"]),
    [Key.ZoomIn]: new Set(["="]),
    [Key.ZoomOut]: new Set(["-"])
}