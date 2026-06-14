import Image from "next/image";
import Link from "next/link";

import { getProjectBySlug } from "@data/projects";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({ params }: Params) {
  const resolvedParams = await params;
  const project = getProjectBySlug(resolvedParams.slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-lg shadow-slate-200/30">
          <h1 className="text-4xl font-semibold">Project not found</h1>
          <p className="mt-4 text-slate-600">
            The requested project could not be found. Please return to the Projects list.
          </p>
          <Link href="/apps/projects" className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl bg-white p-10 shadow-lg shadow-slate-200/30">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Project detail</p>
              <h1 className="mt-4 text-5xl font-semibold text-slate-900">{project.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{project.fullDescription}</p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">{project.category}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{project.status}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{project.timeline}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{project.role}</span>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Features</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                    {project.features.length > 0 ? (
                      project.features.map((feature) => <li key={feature}>{feature}</li>)
                    ) : (
                      <li>Not yet specified.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tech stack</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quick facts</p>
                <div className="mt-4 space-y-3 text-slate-700">
                  <div>
                    <p className="font-semibold text-slate-900">Team size</p>
                    <p>{project.teamSize}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Created</p>
                    <p>{new Date(project.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Updated</p>
                    <p>{new Date(project.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    className="block rounded-full bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    GitHub repository
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    className="block rounded-full border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Visit live site
                  </a>
                ) : null}
                <Link
                  href="/apps/projects"
                  className="block rounded-full bg-slate-100 px-5 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Back to Projects
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl bg-white p-10 shadow-lg shadow-slate-200/30 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Reel slides</h2>
            <p className="mt-3 text-slate-600">
              Preview the project reel collection. Each slide must include either an image or a video.
            </p>
            <div className="mt-6 space-y-4">
              {project.reelSlides.map((reel) => (
                <article key={reel.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{reel.title}</p>
                      <p className="mt-2 text-slate-600">{reel.description}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Order {reel.order}</span>
                  </div>
                  <div className="mt-4 text-sm text-slate-500">
                    {reel.video ? "Video asset available" : "Image asset available"}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Project details</h2>
            <div className="mt-6 space-y-6 text-slate-700">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Challenges</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {project.challenges.length > 0 ? (
                    project.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)
                  ) : (
                    <li>Challenges not yet documented.</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Solutions</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {project.solutions.length > 0 ? (
                    project.solutions.map((solution) => <li key={solution}>{solution}</li>)
                  ) : (
                    <li>Solutions not yet documented.</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Results</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {project.results.length > 0 ? (
                    project.results.map((result) => <li key={result}>{result}</li>)
                  ) : (
                    <li>Results not yet documented.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
