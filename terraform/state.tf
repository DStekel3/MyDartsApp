provider "azurerm" {
    version = "~>1.32.0"
}

terraform {
  backend "azurerm" {
    resource_group_name  = var.state_resource_group
    storage_account_name = var.state_storage_name
    container_name       = var.state_container_name
    key                  = "terraform.tfstate"
  }
}
