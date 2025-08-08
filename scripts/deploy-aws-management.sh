#!/bin/bash

# AWS Organizations と IAM Identity Center デプロイスクリプト
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 色付きメッセージ用の関数
print_info() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

# 使用方法の表示
show_usage() {
    cat << EOF
使用方法: $0 [COMMAND] [OPTIONS]

COMMANDS:
    init-accounts       AWS Organizations アカウント管理の初期化
    deploy-accounts     AWS Organizations アカウント管理のデプロイ
    init-iic           AWS IAM Identity Center の初期化
    deploy-iic         AWS IAM Identity Center のデプロイ
    deploy-all         全てのデプロイ（推奨順序）
    destroy-iic        AWS IAM Identity Center の削除
    destroy-accounts   AWS Organizations アカウント管理の削除（注意！）

OPTIONS:
    -p, --profile      AWS CLI プロファイル名 (デフォルト: axi-budget-management)
    -h, --help         このヘルプを表示

例:
    $0 deploy-all
    $0 deploy-iic --profile my-profile
EOF
}

# 引数解析
COMMAND=""
AWS_PROFILE="axi-budget-management"

while [[ $# -gt 0 ]]; do
    case $1 in
        init-accounts|deploy-accounts|init-iic|deploy-iic|deploy-all|destroy-iic|destroy-accounts)
            COMMAND="$1"
            shift
            ;;
        -p|--profile)
            AWS_PROFILE="$2"
            shift 2
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "不明なオプション: $1"
            show_usage
            exit 1
            ;;
    esac
done

if [[ -z "$COMMAND" ]]; then
    print_error "コマンドが指定されていません"
    show_usage
    exit 1
fi

# AWS CLIプロファイルの確認
check_aws_profile() {
    if ! aws sts get-caller-identity --profile "$AWS_PROFILE" >/dev/null 2>&1; then
        print_error "AWS CLIプロファイル '$AWS_PROFILE' でアクセスできません"
        print_info "aws configure --profile $AWS_PROFILE でプロファイルを設定してください"
        exit 1
    fi

    print_success "AWS CLIプロファイル '$AWS_PROFILE' を確認しました"
}

# Terraform初期化
init_terraform() {
    local dir="$1"
    local description="$2"

    print_info "$description の初期化を開始..."

    cd "$dir"

    if [[ ! -f "terraform.tfvars" && -f "terraform.tfvars.example" ]]; then
        print_warning "terraform.tfvars が見つかりません。terraform.tfvars.example をコピーします。"
        cp terraform.tfvars.example terraform.tfvars
        print_warning "terraform.tfvars を編集してから再実行してください"
        exit 1
    fi

    terraform init
    print_success "$description の初期化が完了しました"
}

# Terraformデプロイ
deploy_terraform() {
    local dir="$1"
    local description="$2"

    print_info "$description のデプロイを開始..."

    cd "$dir"

    # プランの確認
    print_info "Terraform プランを確認中..."
    if ! terraform plan -var="aws_profile=$AWS_PROFILE"; then
        print_error "Terraform プランでエラーが発生しました"
        exit 1
    fi

    # 確認プロンプト
    echo
    read -p "$description をデプロイしますか? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "デプロイをキャンセルしました"
        exit 0
    fi

    # 適用
    if terraform apply -var="aws_profile=$AWS_PROFILE" -auto-approve; then
        print_success "$description のデプロイが完了しました"
    else
        print_error "$description のデプロイでエラーが発生しました"
        exit 1
    fi
}

# Terraform削除
destroy_terraform() {
    local dir="$1"
    local description="$2"

    print_warning "$description の削除を開始します"

    cd "$dir"

    # 警告表示
    echo
    print_warning "注意: この操作により $description が完全に削除されます"
    print_warning "この操作は元に戻せません！"
    echo
    read -p "本当に削除しますか? 'DELETE' と入力してください: " -r
    if [[ "$REPLY" != "DELETE" ]]; then
        print_info "削除をキャンセルしました"
        exit 0
    fi

    # 削除実行
    if terraform destroy -var="aws_profile=$AWS_PROFILE" -auto-approve; then
        print_success "$description の削除が完了しました"
    else
        print_error "$description の削除でエラーが発生しました"
        exit 1
    fi
}

# メイン処理
main() {
    print_info "AWS Organizations & IAM Identity Center デプロイスクリプト"
    print_info "プロファイル: $AWS_PROFILE"
    echo

    check_aws_profile

    case "$COMMAND" in
        init-accounts)
            init_terraform "$PROJECT_ROOT/terraform/aws-accounts" "AWS Organizations アカウント管理"
            ;;
        deploy-accounts)
            deploy_terraform "$PROJECT_ROOT/terraform/aws-accounts" "AWS Organizations アカウント管理"
            ;;
        init-iic)
            init_terraform "$PROJECT_ROOT/terraform/iic" "AWS IAM Identity Center"
            ;;
        deploy-iic)
            deploy_terraform "$PROJECT_ROOT/terraform/iic" "AWS IAM Identity Center"
            ;;
        deploy-all)
            print_info "全コンポーネントのデプロイを開始します"

            # 1. AWS Organizations
            init_terraform "$PROJECT_ROOT/terraform/aws-accounts" "AWS Organizations アカウント管理"
            deploy_terraform "$PROJECT_ROOT/terraform/aws-accounts" "AWS Organizations アカウント管理"

            # 2. IAM Identity Center
            init_terraform "$PROJECT_ROOT/terraform/iic" "AWS IAM Identity Center"
            deploy_terraform "$PROJECT_ROOT/terraform/iic" "AWS IAM Identity Center"

            print_success "全コンポーネントのデプロイが完了しました！"
            ;;
        destroy-iic)
            destroy_terraform "$PROJECT_ROOT/terraform/iic" "AWS IAM Identity Center"
            ;;
        destroy-accounts)
            destroy_terraform "$PROJECT_ROOT/terraform/aws-accounts" "AWS Organizations アカウント管理"
            ;;
    esac
}

# スクリプト実行
main "$@"
