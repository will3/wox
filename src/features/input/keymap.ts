export enum Key {
    Left = "Left",
    Right = "Right",
    ZoomIn = "ZoomIn",
    ZoomOut = "ZoomOut",
}

export const keymap = {
    [Key.Left]: ["a", "left"],
    [Key.Right]: ["d", "right"],
    [Key.ZoomIn]: ["="],
    [Key.ZoomOut]: ["-"],
}
