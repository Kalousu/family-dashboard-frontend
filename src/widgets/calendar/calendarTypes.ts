export type CalendarUser = {
    id: string;
    username: string;
};

export type FormProps = {
    editingEventId: string | null;
    formTitle: string;
    onTitleChange: (v: string) => void;
    formAllDay: boolean;
    onAllDayToggle: () => void;
    formTime: string;
    onTimeChange: (newTime: string) => void;
    formColor: string;
    onColorChange: (color: string) => void;
    showColorPicker: boolean;
    onPickerButtonClick: () => void;
    onColorPickerClose: () => void;
    localPickerColor: string;
    onPickerColorChange: (color: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
    anchorRect?: DOMRect | null;
};

export type CalendarEvent = {
    id: string;
    title: string;
    date: Date;
    color: string;
    allDay: boolean;
    startTime?: string;
    userId: string;
};
