import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    const { data: branchData } = await supabase
      .from('branch_users')
      .select('branch_id')
      .limit(1)
      .single()

    if (branchData) {
      redirect(`/${branchData.branch_id}`)
    } else {
      redirect('/onboarding')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center animate-fade">
      <div className="sidebar-logo-mark mb-6">D</div>
      <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
        კეთილი იყოს თქვენი მობრძანება <span className="text-brand-600">DASTA</span>-ში
      </h1>
      <p className="text-gray-600 max-w-lg mb-8 text-lg">
        თქვენი ბიზნესის მართვის ერთიანი პლატფორმა.
        ამჟამად მიმდინარეობს სისტემის კონფიგურაცია.
      </p>

      <div className="flex gap-4">
        <a href="/login" className="btn btn-lg btn-primary">
          შესვლა სისტემაში
        </a>
        <a href="https://dasta.ge" className="btn btn-lg btn-secondary">
          გაიგეთ მეტი
        </a>
      </div>

      <div className="mt-12 p-4 card-sm border-dashed border-2">
        <p className="text-sm text-gray-500 font-medium">
          სტატუსი: <span className="text-brand-600">Phase 1 (Infrastructure)</span>
        </p>
      </div>
    </div>
  );
}
