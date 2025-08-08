import {
  initDB,
  transactionDB,
  budgetDB,
  authDB,
  accountDB,
  categoryDB,
  accountTypeDB
} from './indexedDB';

/**
 * Development utilities for IndexedDB debugging
 * Only available in development mode
 */

export const indexedDBUtils = {
  /**
   * Log all data in IndexedDB to console
   */
  async logAllData() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('IndexedDB utils are only available in development mode');
      return;
    }

    try {
      await initDB();

      console.group('📊 AxI-budget データベース情報');

      const transactions = await transactionDB.getAll();
      console.log('💰 取引データ:', transactions);

      const budgets = await budgetDB.getAll();
      console.log('�� 予算データ:', budgets);

      const accounts = await accountDB.getAll();
      console.log('🏦 口座データ:', accounts);

      const categories = await categoryDB.getAll();
      console.log('📝 カテゴリデータ:', categories);

      const accountTypes = await accountTypeDB.getAll();
      console.log('🏷️ 口座タイプデータ:', accountTypes);

      const authKeys = ['axi-budget-auth'];
      for (const key of authKeys) {
        const authData = await authDB.get(key);
        console.log(`🔐 認証データ (\${key}):`, authData);
      }

      console.log('\\n📈 統計情報:');
      console.log(`- 取引件数: \${transactions.length}`);
      console.log(`- 予算件数: \${budgets.length}`);
      console.log(`- 口座件数: \${accounts.length}`);
      console.log(`- カテゴリ件数: \${categories.length}`);
      console.log(`- 口座タイプ件数: \${accountTypes.length}`);

      console.groupEnd();
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  },

  /**
   * Clear all data in IndexedDB
   */
  async clearAllData() {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('IndexedDB utils are only available in development mode');
      return;
    }

    if (!window.confirm('⚠️ 全データを削除します。この操作は取り消せません。続行しますか？')) {
      return;
    }

    try {
      await initDB();

      await Promise.all([
        transactionDB.clear(),
        budgetDB.clear(),
        accountDB.clear(),
        categoryDB.clear(),
        accountTypeDB.clear(),
        authDB.clear()
      ]);

      console.log('✅ 全データを削除しました');
      alert('データが削除されました。ページをリロードします。');
      window.location.reload();
    } catch (error) {
      console.error('データの削除に失敗しました:', error);
    }
  }
};

// 開発環境でのみグローバルに公開
if (process.env.NODE_ENV === 'development') {
  (window as any).debugDB = indexedDBUtils;
  console.log(`
🎯 AxI-budget デバッグユーティリティが利用可能です:

debugDB.logAllData()         // 全データの確認
debugDB.clearAllData()       // 全データの削除

開発者コンソールで上記のコマンドを実行してください。
  `);
}

export default indexedDBUtils;
