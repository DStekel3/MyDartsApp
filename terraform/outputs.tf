output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}


output "app_name" {
  value = azurerm_app_service.webapp.name
}

output "speech_api_key" {
  value = azurerm_cognitive_account.cognitive.primary_access_key
  sensitive = true
}
