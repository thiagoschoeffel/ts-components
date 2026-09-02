import type { App } from 'vue'
import './tailwind.css'
import Avatar from './components/Avatar/Avatar.vue'
import Alert from './components/Alert/Alert.vue'
import AlertDialog from './components/AlertDialog/AlertDialog.vue'
import Badge from './components/Badge/Badge.vue'
import Button from './components/Button/Button.vue'
import Card from './components/Card/Card.vue'
import Checkbox from './components/Checkbox/Checkbox.vue'
import Chips from './components/Chips/Chips.vue'
import Combobox from './components/Combobox/Combobox.vue'
import DataTable from './components/DataTable/DataTable.vue'
import DatePicker from './components/DatePicker/DatePicker.vue'
import DateRangePicker from './components/DateRangePicker/DateRangePicker.vue'
import Dialog from './components/Dialog/Dialog.vue'
import Drawer from './components/Drawer/Drawer.vue'
import EmptyState from './components/EmptyState/EmptyState.vue'
import DropdownMenu from './components/DropdownMenu/DropdownMenu.vue'
import Input from './components/Input/Input.vue'
import MultiSelect from './components/MultiSelect/MultiSelect.vue'
import PageHeader from './components/PageHeader/PageHeader.vue'
import Pagination from './components/Pagination/Pagination.vue'
import Popover from './components/Popover/Popover.vue'
import Progress from './components/Progress/Progress.vue'
import RadioGroup from './components/RadioGroup/RadioGroup.vue'
import ScrollArea from './components/ScrollArea/ScrollArea.vue'
import SectionCard from './components/SectionCard/SectionCard.vue'
import Select from './components/Select/Select.vue'
import Tabs from './components/Tabs/Tabs.vue'
import Textarea from './components/Textarea/Textarea.vue'
import Toggle from './components/Toggle/Toggle.vue'

export {
  ArrowDownWideNarrowIcon,
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowRightIcon,
  ArrowUpNarrowWideIcon,
  BadgeDollarSignIcon,
  BikeIcon,
  BoldIcon,
  BookOpenIcon,
  BoxesIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleDollarSignIcon,
  ClipboardListIcon,
  CookingPotIcon,
  CornerDownRightIcon,
  EllipsisIcon,
  FactoryIcon,
  HomeIcon,
  InfoIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  LogOutIcon,
  MenuIcon,
  MessagesSquareIcon,
  MinusIcon,
  PackageCheckIcon,
  PlusIcon,
  RedoIcon,
  RemoveFormattingIcon,
  SearchIcon,
  SettingsIcon,
  TriangleAlertIcon,
  StrikethroughIcon,
  TruckIcon,
  UserRoundCogIcon,
  UsersIcon,
  UnderlineIcon,
  UndoIcon,
  XIcon
} from './icons'

export { Alert, AlertDialog, Avatar, Badge, Button, Card, Checkbox, Chips, Combobox, DataTable, DatePicker, DateRangePicker, Dialog, Drawer, DropdownMenu, EmptyState, Input, MultiSelect, PageHeader, Pagination, Popover, Progress, RadioGroup, ScrollArea, SectionCard, Select, Tabs, Textarea, Toggle }
export type { AlertProps, AlertSize, AlertVariants } from './components/Alert/Alert.vue'
export type { AlertDialogConfirmVariant, AlertDialogProps, AlertDialogSize } from './components/AlertDialog/AlertDialog.vue'
export type { BadgeSize, BadgeVariant } from './components/Badge/Badge.vue'
export type { ChipsProps, ChipsSize, ChipsVariant } from './components/Chips/Chips.vue'
export type { ComboboxOption, ComboboxProps, ComboboxSize } from './components/Combobox/Combobox.vue'
export type {
  DataTableColumn,
  DataTableKey,
  DataTableRow,
  DataTableSortDirection,
  DataTableSortMode
} from './components/DataTable/DataTable.vue'
export type {
  DatePickerAlign,
  DatePickerDaySlotProps,
  DatePickerMatcher,
  DatePickerProps,
  DatePickerSide,
  DatePickerSize,
  DatePickerWeekdayFormat,
  DatePickerWeekStartsOn
} from './components/DatePicker/DatePicker.vue'
export type { DateValue } from '@internationalized/date'
export type {
  DateRangePickerAlign,
  DateRangePickerDaySlotProps,
  DateRangePickerFixedDate,
  DateRangePickerMatcher,
  DateRangePickerProps,
  DateRangePickerSide,
  DateRangePickerSize,
  DateRangePickerValue,
  DateRangePickerWeekdayFormat,
  DateRangePickerWeekStartsOn
} from './components/DateRangePicker/DateRangePicker.vue'
export type { DialogProps, DialogSize } from './components/Dialog/Dialog.vue'
export type {
  DrawerModal,
  DrawerOpenChangeDetails,
  DrawerOpenChangeReason,
  DrawerProps,
  DrawerSide,
  DrawerSize,
  DrawerSnapPoint
} from './components/Drawer/Drawer.vue'
export type { EmptyStateProps, EmptyStateSize } from './components/EmptyState/EmptyState.vue'
export type {
  DropdownMenuActionItem,
  DropdownMenuAlign,
  DropdownMenuEntry,
  DropdownMenuLabelItem,
  DropdownMenuSeparatorItem,
  DropdownMenuSide,
  DropdownMenuSubmenuItem
} from './components/DropdownMenu/DropdownMenu.vue'
export type { InputSize, InputType, InputValue } from './components/Input/Input.vue'
export type { MultiSelectOption, MultiSelectProps, MultiSelectSize } from './components/MultiSelect/MultiSelect.vue'
export type { PopoverAlign, PopoverProps, PopoverSide, PopoverSize } from './components/Popover/Popover.vue'
export type { SelectOption, SelectProps, SelectSize } from './components/Select/Select.vue'
export type { SectionCardProps } from './components/SectionCard/SectionCard.vue'
export type { TabItem, TabsActivationMode, TabsOrientation, TabsProps, TabsSize, TabsVariant } from './components/Tabs/Tabs.vue'
export type { TextareaProps, TextareaResize, TextareaSize } from './components/Textarea/Textarea.vue'
export type { ToggleProps, ToggleSize } from './components/Toggle/Toggle.vue'
export { plainTextToRichText, richTextToPlainText, sanitizeRichText } from './components/Textarea/richText'

export default {
  install(app: App) {
    app.component('Alert', Alert)
    app.component('AlertDialog', AlertDialog)
    app.component('Button', Button)
    app.component('Avatar', Avatar)
    app.component('Badge', Badge)
    app.component('Card', Card)
    app.component('Checkbox', Checkbox)
    app.component('Chips', Chips)
    app.component('Combobox', Combobox)
    app.component('DataTable', DataTable)
    app.component('DatePicker', DatePicker)
    app.component('DateRangePicker', DateRangePicker)
    app.component('Dialog', Dialog)
    app.component('Drawer', Drawer)
    app.component('EmptyState', EmptyState)
    app.component('DropdownMenu', DropdownMenu)
    app.component('Input', Input)
    app.component('MultiSelect', MultiSelect)
    app.component('PageHeader', PageHeader)
    app.component('Pagination', Pagination)
    app.component('Popover', Popover)
    app.component('Progress', Progress)
    app.component('RadioGroup', RadioGroup)
    app.component('ScrollArea', ScrollArea)
    app.component('SectionCard', SectionCard)
    app.component('Select', Select)
    app.component('Tabs', Tabs)
    app.component('Textarea', Textarea)
    app.component('Toggle', Toggle)
  }
}
