const { spawn } = require('child_process');
const iconv = require('iconv-lite');

const restartInterval = 3600 * 1000; // 1時間ごとに再起動

console.log('サーバーを起動...');

// Geyser-Standalone.jar の起動
const geyserProcess = spawn('java', ['-jar', 'Geyser-Standalone.jar'], {
  stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
});

// 標準出力と標準エラー出力のハンドリング (Shift_JIS を UTF-8 に変換)
geyserProcess.stdout.on('data', (data) => {
  const convertedData = iconv.decode(data, 'Shift_JIS');
  console.log(`Geyser: ${convertedData}`);
});

geyserProcess.stderr.on('data', (data) => {
  const convertedData = iconv.decode(data, 'Shift_JIS');
  console.error(`Geyser Error: ${convertedData}`);
});

geyserProcess.on('close', (code) => {
  console.log(`Geyser exited with code ${code}`);
});

// MCXboxBroadcastStandalone.jar の起動 (Geyser の起動後に実行)
geyserProcess.on('spawn', () => {
  const mcXboxProcess = spawn('java', ['-jar', 'MCXboxBroadcastStandalone.jar'], {
    cwd: './mc', // 相対パスを使用
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });

  // 標準出力と標準エラー出力のハンドリング (UTF-8 を想定)
  mcXboxProcess.stdout.setEncoding('utf8');
  mcXboxProcess.stdout.on('data', (data) => {
    console.log(`MCXboxBroadcast: ${data}`);
  });

  mcXboxProcess.stderr.setEncoding('utf8');
  mcXboxProcess.stderr.on('data', (data) => {
    console.error(`MCXboxBroadcast Error: ${data}`);
  });

  mcXboxProcess.on('close', (code) => {
    console.log(`MCXboxBroadcast exited with code ${code}`);
  });
});

// 定期的な再起動
setInterval(() => {
  console.log('サーバーを再起動します...');
  // 既存のプロセスを終了
  geyserProcess.kill();

  // 新しい Geyser プロセスを起動
  const newGeyserProcess = spawn('java', ['-jar', 'Geyser-Standalone.jar'], {
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
  });

  // 標準出力と標準エラー出力のハンドリング (Shift_JIS を UTF-8 に変換)
  newGeyserProcess.stdout.on('data', (data) => {
    const convertedData = iconv.decode(data, 'Shift_JIS');
    console.log(`Geyser: ${convertedData}`);
  });

  newGeyserProcess.stderr.on('data', (data) => {
    const convertedData = iconv.decode(data, 'Shift_JIS');
    console.error(`Geyser Error: ${convertedData}`);
  });

  newGeyserProcess.on('close', (code) => {
    console.log(`Geyser exited with code ${code}`);
  });

  // 新しい MCXboxBroadcast プロセスを起動 (Geyser の起動後に実行)
  newGeyserProcess.on('spawn', () => {
    const newMcXboxProcess = spawn('java', ['-jar', 'MCXboxBroadcastStandalone.jar'], {
      cwd: './mc', // 相対パスを使用
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    });

    // 標準出力と標準エラー出力のハンドリング (UTF-8 を想定)
    newMcXboxProcess.stdout.setEncoding('utf8');
    newMcXboxProcess.stdout.on('data', (data) => {
      console.log(`MCXboxBroadcast: ${data}`);
    });

    newMcXboxProcess.stderr.setEncoding('utf8');
    newMcXboxProcess.stderr.on('data', (data) => {
      console.error(`MCXboxBroadcast Error: ${data}`);
    });

    newMcXboxProcess.on('close', (code) => {
      console.log(`MCXboxBroadcast exited with code ${code}`);
    });
  });
}, restartInterval);