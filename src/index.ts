import type { App } from 'vue'
import './tailwind.css'
import Avatar from './components/Avatar/Avatar.vue'
import Badge from './components/Badge/Badge.vue'
import Button from './components/Button/Button.vue'
import Card from './components/Card/Card.vue'
import Checkbox from './components/Checkbox/Checkbox.vue'
import DataTable from './components/DataTable/DataTable.vue'
import PageHeader from './components/PageHeader/PageHeader.vue'
import Pagination from './components/Pagination/Pagination.vue'
import Progress from './components/Progress/Progress.vue'
import RadioGroup from './components/RadioGroup/RadioGroup.vue'
import ScrollArea from './components/ScrollArea/ScrollArea.vue'

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
  ChevronLeftIcon,
  ChevronRightIcon,
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
  SettingsIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserRoundCogIcon,
  UsersIcon,
  XIcon
} from './icons'

export { Avatar, Badge, Button, Card, Checkbox, DataTable, PageHeader, Pagination, Progress, RadioGroup, ScrollArea }
export type {
  DataTableColumn,
  DataTableKey,
  DataTableRow,
  DataTableSortDirection,
  DataTableSortMode
} from './components/DataTable/DataTable.vue'

export default {
  install(app: App) {
    app.component('Button', Button)
    app.component('Avatar', Avatar)
    app.component('Badge', Badge)
    app.component('Card', Card)
    app.component('Checkbox', Checkbox)
    app.component('DataTable', DataTable)
    app.component('PageHeader', PageHeader)
    app.component('Pagination', Pagination)
    app.component('Progress', Progress)
    app.component('RadioGroup', RadioGroup)
    app.component('ScrollArea', ScrollArea)
  }
}
