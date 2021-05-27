import pluginPkg from '../../package.json'
import pluginId from './pluginId'
import App from './containers/App'
import Initializer from './containers/Initializer'
import pluginLogo from './assets/logo.svg'
import lifecycles from './lifecycles'
import trads from './translations'

export default strapi => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description
  const icon = pluginPkg.strapi.icon
  const name = pluginPkg.strapi.name

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: App,
    pluginLogo,
    name,
    preventComponentRendering: false,
    trads,
    menu: {
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`,
          icon,
          label: {
            id: `${pluginId}.plugin.name`,
            defaultMessage: 'Entry Versioning'
          },
          name,
          permissions: [
            {
              action: 'plugins::versioning-mongo.restore',
              subject: null
            }
          ]
        }
      ]
    }
  }

  return strapi.registerPlugin(plugin)
}
