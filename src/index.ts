import type { App } from 'vue'
import './tailwind.css'
import Avatar from './components/Avatar/Avatar.vue'
import Badge from './components/Badge/Badge.vue'
import Button from './components/Button/Button.vue'
import Card from './components/Card/Card.vue'
import Checkbox from './components/Checkbox/Checkbox.vue'
import DataTable from './components/DataTable/DataTable.vue'
import Drawer from './components/Drawer/Drawer.vue'
import DropdownMenu from './components/DropdownMenu/DropdownMenu.vue'
import Input from './components/Input/Input.vue'
import MultiSelect from './components/MultiSelect/MultiSelect.vue'
import PageHeader from './components/PageHeader/PageHeader.vue'
import Pagination from './components/Pagination/Pagination.vue'
import Popover from './components/Popover/Popover.vue'
import Progress from './components/Progress/Progress.vue'
import RadioGroup from './components/RadioGroup/RadioGroup.vue'
import ScrollArea from './components/ScrollArea/ScrollArea.vue'
import Select from './components/Select/Select.vue'
import Tabs from './components/Tabs/Tabs.vue'

export {
  ArrowDownWideNarrowIcon,
  ArrowRightIcon,
  ArrowUpNarrowWideIcon,
  BadgeDollarSignIcon,
  BikeIcon,
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
  LogOutIcon,
  MenuIcon,
  MessagesSquareIcon,
  MinusIcon,
  PackageCheckIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserRoundCogIcon,
  UsersIcon,
  XIcon
} from './icons'

export { Avatar, Badge, Button, Card, Checkbox, DataTable, Drawer, DropdownMenu, Input, MultiSelect, PageHeader, Pagination, Popover, Progress, RadioGroup, ScrollArea, Select, Tabs }
export type {
  DataTableColumn,
  DataTableKey,
  DataTableRow,
  DataTableSortDirection,
  DataTableSortMode
} from './components/DataTable/DataTable.vue'
export type {
  DrawerModal,
  DrawerOpenChangeDetails,
  DrawerOpenChangeReason,
  DrawerProps,
  DrawerSide,
  DrawerSize,
  DrawerSnapPoint
} from './components/Drawer/Drawer.vue'
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
export type { TabItem, TabsActivationMode, TabsOrientation, TabsProps, TabsSize, TabsVariant } from './components/Tabs/Tabs.vue'

export default {
  install(app: App) {
    app.component('Button', Button)
    app.component('Avatar', Avatar)
    app.component('Badge', Badge)
    app.component('Card', Card)
    app.component('Checkbox', Checkbox)
    app.component('DataTable', DataTable)
    app.component('Drawer', Drawer)
    app.component('DropdownMenu', DropdownMenu)
    app.component('Input', Input)
    app.component('MultiSelect', MultiSelect)
    app.component('PageHeader', PageHeader)
    app.component('Pagination', Pagination)
    app.component('Popover', Popover)
    app.component('Progress', Progress)
    app.component('RadioGroup', RadioGroup)
    app.component('ScrollArea', ScrollArea)
    app.component('Select', Select)
    app.component('Tabs', Tabs)
  }
}
