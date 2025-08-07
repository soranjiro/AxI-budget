# API Gateway Module
resource "aws_api_gateway_rest_api" "budget_api" {
  name        = "${var.project_name}-${var.environment}-api"
  description = "Budget API for ${var.project_name}"

  binary_media_types = ["application/octet-stream", "image/*", "text/csv"]

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-api"
  }
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "budget_api" {
  depends_on = [
    aws_api_gateway_integration.lambda_integration,
    aws_api_gateway_integration.cors_integration
  ]

  rest_api_id = aws_api_gateway_rest_api.budget_api.id

  lifecycle {
    create_before_destroy = true
  }

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.budget_api_resource.id,
      aws_api_gateway_method.budget_api_method.id,
      length(aws_api_gateway_integration.lambda_integration) > 0 ? aws_api_gateway_integration.lambda_integration[0].id : "no-lambda-integration",
    ]))
  }
}

# API Gateway Stage
resource "aws_api_gateway_stage" "budget_api_stage" {
  deployment_id = aws_api_gateway_deployment.budget_api.id
  rest_api_id   = aws_api_gateway_rest_api.budget_api.id
  stage_name    = var.environment

  tags = {
    Name = "${var.project_name}-${var.environment}-api-stage"
  }
}

# API Gateway Resource
resource "aws_api_gateway_resource" "budget_api_resource" {
  rest_api_id = aws_api_gateway_rest_api.budget_api.id
  parent_id   = aws_api_gateway_rest_api.budget_api.root_resource_id
  path_part   = "{proxy+}"
}

# API Gateway Method
resource "aws_api_gateway_method" "budget_api_method" {
  rest_api_id   = aws_api_gateway_rest_api.budget_api.id
  resource_id   = aws_api_gateway_resource.budget_api_resource.id
  http_method   = "ANY"
  authorization = "NONE"
}

# API Gateway Integration
resource "aws_api_gateway_integration" "lambda_integration" {
  count = var.lambda_invoke_arn != "" ? 1 : 0

  rest_api_id = aws_api_gateway_rest_api.budget_api.id
  resource_id = aws_api_gateway_resource.budget_api_resource.id
  http_method = aws_api_gateway_method.budget_api_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# Lambda permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  count = var.lambda_function_name != "" ? 1 : 0

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.budget_api.execution_arn}/*/*"
}

# CORS Method
resource "aws_api_gateway_method" "cors_method" {
  rest_api_id   = aws_api_gateway_rest_api.budget_api.id
  resource_id   = aws_api_gateway_resource.budget_api_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# CORS Integration
resource "aws_api_gateway_integration" "cors_integration" {
  rest_api_id = aws_api_gateway_rest_api.budget_api.id
  resource_id = aws_api_gateway_resource.budget_api_resource.id
  http_method = aws_api_gateway_method.cors_method.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

# CORS Method Response
resource "aws_api_gateway_method_response" "cors_method_response" {
  rest_api_id = aws_api_gateway_rest_api.budget_api.id
  resource_id = aws_api_gateway_resource.budget_api_resource.id
  http_method = aws_api_gateway_method.cors_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# CORS Integration Response
resource "aws_api_gateway_integration_response" "cors_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.budget_api.id
  resource_id = aws_api_gateway_resource.budget_api_resource.id
  http_method = aws_api_gateway_method.cors_method.http_method
  status_code = aws_api_gateway_method_response.cors_method_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT,DELETE'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}
