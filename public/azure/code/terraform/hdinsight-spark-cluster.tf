resource "azurerm_hdinsight_spark_cluster" "main" {
  name                = "spark-${local.naming_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  cluster_version     = "5.1"
  tier                = "Standard"
  tls_min_version     = "1.2"

  component_version {
    spark = "3.3"
  }

  gateway {
    username = "acctestusrgw"
    password = "TerrAform123!"
  }

  storage_account {
    storage_container_url = azurerm_storage_container.main.url
    storage_account_key   = azurerm_storage_account.main.primary_access_key
    is_default            = true
  }

  roles {
    head_node {
      vm_size  = "Standard_A4_V2"
      username = "acctestusrvm"
      password = "AccTestvdSC4daf986!"
    }

    worker_node {
      vm_size               = "Standard_A4_V2"
      username              = "acctestusrvm"
      password              = "AccTestvdSC4daf986!"
      target_instance_count = 3
    }

    zookeeper_node {
      vm_size  = "Standard_A4_V2"
      username = "acctestusrvm"
      password = "AccTestvdSC4daf986!"
    }
  }
}