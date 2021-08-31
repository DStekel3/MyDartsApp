locals {
	  location = "westeurope"
	  tags = {
	    modified_by     = "Terraform"
	    modified_at_utc = timestamp()
	    environment     = var.branch
	  }
}


resource "azurerm_resource_group" "rg"{
    name = "${var.application}-${var.branch}"
    location = local.location
}


resource "azurerm_cognitive_account" "cognitive" {
  name                = "${var.application}${replace(var.branch, "-", "")}cognitive"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "SpeechServices"

  sku {
    name = "S0"
    tier = "Standard"
  }
}

resource "azurerm_app_service_plan" "plan" {
  name                = "${var.application}${replace(var.branch, "-", "")}plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_app_service" "webapp" {
  name                = "${var.application}${replace(var.branch, "-", "")}service"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.plan.id

  app_settings = {
    "SOME_KEY" = "some-value"
  }
}
