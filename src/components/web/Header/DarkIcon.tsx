import React, { memo } from 'react';
import { useThemeContext } from '@/contexts';

function DarkIconComponent() {
  const { mode } = useThemeContext();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 0 24 24" id="moon">
      <path
        fill={mode === 'dark' ? '#0d1b2a' : '#fff'}
        d="M17.189 3.5c.465 1.403 1.561 2.479 3.348 3.288a1.001 1.001 0 0 1-.031 1.836c-1.648.68-2.633 1.623-3.333 3.318-.285.689-.934.643-.934.643-.403 0-.767-.242-.923-.614-.696-1.666-1.78-2.756-3.315-3.335a.999.999 0 0 1-.055-1.848c1.765-.79 2.859-1.868 3.347-3.295.138-.405.519-.673.946-.677.724-.008.95.684.95.684zm-2.751 4.178A7.454 7.454 0 0 1 16.23 9.49a7.445 7.445 0 0 1 1.829-1.803 7.605 7.605 0 0 1-1.821-1.732 7.597 7.597 0 0 1-1.8 1.723zm5.081 11.24a10.177 10.177 0 0 0 2.253-3.393 1 1 0 0 0-1.303-1.303 8.25 8.25 0 0 1-8.956-1.814A8.254 8.254 0 0 1 9.7 3.453.999.999 0 0 0 8.397 2.15a10.198 10.198 0 0 0-3.392 2.253 10.205 10.205 0 0 0-2.823 5.331 1 1 0 0 0 1.964.374A8.216 8.216 0 0 1 7.19 5.135a10.247 10.247 0 0 0 2.91 8.688 10.246 10.246 0 0 0 8.688 2.91c-.21.269-.438.526-.683.771-3.222 3.221-8.463 3.222-11.686 0a8.223 8.223 0 0 1-2.281-4.352 1.002 1.002 0 0 0-1.968.36 10.202 10.202 0 0 0 2.834 5.406 10.231 10.231 0 0 0 7.258 3.001 10.237 10.237 0 0 0 7.257-3.001z"
      ></path>
    </svg>
  );
}

export const DarkIcon = memo(DarkIconComponent);
